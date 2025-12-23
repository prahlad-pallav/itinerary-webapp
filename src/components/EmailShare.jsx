import { useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from '@emailjs/browser';
import AlertModal from './AlertModal';
import './EmailShare.css';

export default function EmailShare({ plan, expenses, packingItems, userName = 'You' }) {
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [emailData, setEmailData] = useState({
    partnerEmails: '',
    yourEmail: '',
    subject: 'Trip Planning Details',
    shareTripPlan: plan && plan.length > 0,
    shareExpenses: expenses && expenses.length > 0,
    sharePackingList: packingItems && packingItems.length > 0,
    message: ''
  });

  // Initialize EmailJS (users need to set up their own EmailJS account)
  // For now, we'll use a fallback to mailto: if EmailJS is not configured
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  const formatTripPlan = () => {
    if (!plan || plan.length === 0) return 'No destinations planned yet.';
    
    let content = 'TRIP PLAN:\n\n';
    const totalCost = plan.reduce((sum, item) => sum + item.price * item.nights, 0);
    
    plan.forEach((item, index) => {
      content += `${index + 1}. ${item.name} - ${item.location}\n`;
      content += `   Duration: ${item.nights} nights\n`;
      content += `   Cost: $${(item.price * item.nights).toLocaleString()}\n`;
      content += `   Description: ${item.description}\n\n`;
    });
    
    content += `Total Estimated Cost: $${totalCost.toLocaleString()}\n`;
    return content;
  };

  const formatExpenses = () => {
    if (!expenses || expenses.length === 0) return 'No expenses tracked yet.';
    
    let content = 'EXPENSE SUMMARY:\n\n';
    const total = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    
    expenses.forEach((expense, index) => {
      content += `${index + 1}. ${expense.description}\n`;
      content += `   Amount: $${parseFloat(expense.amount).toFixed(2)}\n`;
      content += `   Paid by: ${expense.paidBy}\n`;
      content += `   Category: ${expense.category}\n`;
      if (expense.participants && expense.participants.length > 0) {
        content += `   Split between: ${expense.participants.join(', ')}\n`;
      }
      content += '\n';
    });
    
    content += `Total Expenses: $${total.toFixed(2)}\n`;
    return content;
  };

  const formatPackingList = () => {
    if (!packingItems || packingItems.length === 0) return 'No packing items added yet.';
    
    let content = 'PACKING LIST:\n\n';
    
    // Group by category
    const grouped = packingItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    Object.keys(grouped).forEach(category => {
      content += `${category.toUpperCase()}:\n`;
      grouped[category].forEach((item, index) => {
        const status = item.packed ? '✓' : '☐';
        const qty = item.quantity > 1 ? ` (Qty: ${item.quantity})` : '';
        content += `  ${status} ${item.name}${qty}\n`;
      });
      content += '\n';
    });
    
    const totalItems = packingItems.length;
    const packedItems = packingItems.filter(item => item.packed).length;
    content += `Total Items: ${totalItems}\n`;
    content += `Packed: ${packedItems}/${totalItems} (${Math.round((packedItems / totalItems) * 100)}%)\n`;
    
    return content;
  };

  const buildEmailBody = () => {
    let emailBody = `Hi there!\n\n`;
    emailBody += `${userName} wants to share trip planning details with you.\n\n`;
    
    if (emailData.message) {
      emailBody += `Message from ${userName}:\n${emailData.message}\n\n`;
    }

    if (emailData.shareTripPlan) {
      emailBody += formatTripPlan() + '\n\n';
    }

    if (emailData.shareExpenses) {
      emailBody += formatExpenses() + '\n\n';
    }

    if (emailData.sharePackingList) {
      emailBody += formatPackingList() + '\n\n';
    }

    emailBody += `\n---\nSent from Vacation Planner App\n`;
    return emailBody;
  };

  const handleSendEmail = async () => {
    if (!emailData.partnerEmails.trim()) {
      setAlertMessage('Please enter at least one partner email address.');
      setShowAlert(true);
      return;
    }

    if (!emailData.yourEmail.trim()) {
      setAlertMessage('Please enter your email address.');
      setShowAlert(true);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const partnerEmails = emailData.partnerEmails.split(',').map(e => e.trim()).filter(e => e);
    
    if (!emailRegex.test(emailData.yourEmail)) {
      setAlertMessage('Please enter a valid email address for yourself.');
      setShowAlert(true);
      return;
    }

    const invalidEmails = partnerEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      setAlertMessage(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      setShowAlert(true);
      return;
    }

    if (!emailData.shareTripPlan && !emailData.shareExpenses && !emailData.sharePackingList) {
      setAlertMessage('Please select at least one item to share (Trip Plan, Expenses, or Packing List).');
      setShowAlert(true);
      return;
    }

    setIsSending(true);

    try {
      const emailBody = buildEmailBody();

      // Try to send via EmailJS if configured
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY);

        const templateParams = {
          to_email: partnerEmails.join(','),
          from_email: emailData.yourEmail,
          subject: emailData.subject,
          message: emailBody,
          user_name: userName
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        
        setAlertMessage('Email sent successfully!');
        setShowAlert(true);
        setShowModal(false);
        setEmailData({
          partnerEmails: '',
          yourEmail: '',
          subject: 'Trip Planning Details',
          shareTripPlan: plan && plan.length > 0,
          shareExpenses: expenses && expenses.length > 0,
          sharePackingList: packingItems && packingItems.length > 0,
          message: ''
        });
      } else {
        // Fallback to mailto: link
        const mailtoLink = `mailto:${partnerEmails.join(',')}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        
        setAlertMessage('Opening your email client. Please send the email manually.');
        setShowAlert(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Always fallback to mailto for any error
      const emailBody = buildEmailBody();
      const mailtoLink = `mailto:${partnerEmails.join(',')}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;
      
      // Provide helpful error message
      let errorMsg = 'Opening your email client. Please send the email manually.';
      if (error.text && error.text.includes('insufficient authentication scopes')) {
        errorMsg = 'Gmail API authentication issue. Opening your email client instead.';
      } else if (error.text) {
        errorMsg = `Email service error: ${error.text}. Opening your email client instead.`;
      }
      
      setAlertMessage(errorMsg);
      setShowAlert(true);
      setShowModal(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button className="Button Button--primary" onClick={() => setShowModal(true)}>
        📧 Share via Email
      </button>

      {showModal && (
        <div className="EmailShare__Backdrop" onClick={() => setShowModal(false)}>
          <div className="EmailShare__Modal" onClick={(e) => e.stopPropagation()}>
            <div className="EmailShare__Header">
              <h3>Share Trip Details via Email</h3>
              <button className="EmailShare__Close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="EmailShare__Body">
              <div className="EmailShare__FormGroup">
                <label>Your Email</label>
                <input
                  type="email"
                  value={emailData.yourEmail}
                  onChange={(e) => setEmailData({ ...emailData, yourEmail: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="EmailShare__FormGroup">
                <label>Partner Emails (comma-separated)</label>
                <input
                  type="text"
                  value={emailData.partnerEmails}
                  onChange={(e) => setEmailData({ ...emailData, partnerEmails: e.target.value })}
                  placeholder="friend1@example.com, friend2@example.com"
                  required
                />
                <p className="EmailShare__Hint">Separate multiple emails with commas</p>
              </div>

              <div className="EmailShare__FormGroup">
                <label>Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="Trip Planning Details"
                />
              </div>

              <div className="EmailShare__FormGroup">
                <label>What to Share</label>
                <div className="EmailShare__Checkboxes">
                  <label className="EmailShare__CheckboxLabel">
                    <input
                      type="checkbox"
                      checked={emailData.shareTripPlan}
                      onChange={(e) => setEmailData({ ...emailData, shareTripPlan: e.target.checked })}
                    />
                    <span>Trip Plan ({plan?.length || 0} destinations)</span>
                  </label>
                  <label className="EmailShare__CheckboxLabel">
                    <input
                      type="checkbox"
                      checked={emailData.shareExpenses}
                      onChange={(e) => setEmailData({ ...emailData, shareExpenses: e.target.checked })}
                    />
                    <span>Expenses ({expenses?.length || 0} items)</span>
                  </label>
                  {packingItems && (
                    <label className="EmailShare__CheckboxLabel">
                      <input
                        type="checkbox"
                        checked={emailData.sharePackingList}
                        onChange={(e) => setEmailData({ ...emailData, sharePackingList: e.target.checked })}
                      />
                      <span>Packing List ({packingItems.length} items)</span>
                    </label>
                  )}
                </div>
                {(!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) && (
                  <p className="EmailShare__Hint" style={{ marginTop: '8px', color: 'var(--accent-blue)' }}>
                    💡 Tip: Email will open in your default email client. To send directly, configure EmailJS in environment variables.
                  </p>
                )}
              </div>

              <div className="EmailShare__FormGroup">
                <label>Personal Message (optional)</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  placeholder="Add a personal note to your partners..."
                  rows="3"
                />
              </div>
            </div>

            <div className="EmailShare__Actions">
              <button className="Button Button--ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="Button Button--primary"
                onClick={handleSendEmail}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Notice"
        message={alertMessage}
        type={alertMessage.includes('successfully') ? 'success' : 'warning'}
      />
    </>
  );
}

EmailShare.propTypes = {
  plan: PropTypes.array,
  expenses: PropTypes.array,
  packingItems: PropTypes.array,
  userName: PropTypes.string
};

