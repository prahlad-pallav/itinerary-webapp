import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatCurrencyWithDecimals } from '../utils/formatters';
import { useExpenseBalances } from '../hooks/useExpenseBalances';
import { EXPENSE_CATEGORIES } from '../constants/destinations';
import InputModal from '../components/InputModal';
import AlertModal from '../components/AlertModal';
import './ExpenseSplitter.css';

export default function ExpenseSplitter() {
  const [users, setUsers] = useState(['You', 'Friend 1', 'Friend 2']);
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: 'You',
    splitType: 'equal',
    category: 'General',
    participants: []
  });

  const { balances, simplifiedBalances } = useExpenseBalances(expenses, users);

  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

  const handleAddUser = (userName) => {
    if (users.includes(userName)) {
      setAlertMessage('This user already exists');
      setShowAlertModal(true);
      return;
    }
    setUsers([...users, userName]);
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || newExpense.participants.length === 0) {
      setAlertMessage('Please fill in all fields and select at least one participant');
      setShowAlertModal(true);
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      setAlertMessage('Please enter a valid positive amount');
      setShowAlertModal(true);
      return;
    }

    setExpenses([
      ...expenses,
      {
        ...newExpense,
        id: Date.now(),
        amount: parseFloat(newExpense.amount)
      }
    ]);

    setNewExpense({
      description: '',
      amount: '',
      paidBy: 'You',
      splitType: 'equal',
      category: 'General',
      participants: []
    });
    setShowAddExpense(false);
  };

  const toggleParticipant = (user) => {
    setNewExpense(prev => ({
      ...prev,
      participants: prev.participants.includes(user)
        ? prev.participants.filter(p => p !== user)
        : [...prev.participants, user]
    }));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <section id="expenses" className="ExpenseSplitter">
      <div className="ExpenseSplitter__Header">
        <div>
          <p className="Pill Pill--dark">Expense Splitter</p>
          <h2>Split expenses with your travel group</h2>
          <p className="Lede Lede--small">
            Track shared costs, see who owes whom, and settle up easily.
          </p>
        </div>
        <div className="ExpenseSplitter__Stats">
          <div>
            <p className="Label">Total Expenses</p>
            <p className="Value Value--large">{formatCurrencyWithDecimals(totalExpenses)}</p>
          </div>
          <div>
            <p className="Label">Expenses Count</p>
            <p className="Value Value--large">{expenses.length}</p>
          </div>
        </div>
      </div>

      <div className="ExpenseSplitter__Controls">
        <div className="ExpenseSplitter__UsersSection">
          <div className="ExpenseSplitter__UsersHeader">
            <label>Group Members</label>
            <button className="Button Button--ghost Button--small" onClick={() => setShowAddUserModal(true)}>+ Add Member</button>
          </div>
          <div className="ExpenseSplitter__UsersList">
            {users.map((user, idx) => (
              <span key={idx} className="ExpenseSplitter__UserChip">{user}</span>
            ))}
          </div>
        </div>
        <button className="Button Button--primary" onClick={() => setShowAddExpense(!showAddExpense)}>
          {showAddExpense ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showAddExpense && (
        <div className="ExpenseSplitter__AddForm">
          <h3>Add New Expense</h3>
          <div className="ExpenseSplitter__FormGrid">
            <div className="ExpenseSplitter__FormGroup">
              <label>Description</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="e.g., Dinner at restaurant"
              />
            </div>
            <div className="ExpenseSplitter__FormGroup">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="ExpenseSplitter__FormGroup">
              <label>Paid By</label>
              <select
                value={newExpense.paidBy}
                onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="ExpenseSplitter__FormGroup">
              <label>Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="ExpenseSplitter__FormGroup">
            <label>Split Between</label>
            <div className="ExpenseSplitter__ParticipantsGrid">
              {users.map(user => (
                <button
                  key={user}
                  type="button"
                  className={`ExpenseSplitter__ParticipantBtn ${newExpense.participants.includes(user) ? 'ExpenseSplitter__ParticipantBtn--active' : ''}`}
                  onClick={() => toggleParticipant(user)}
                >
                  {user}
                  {newExpense.participants.includes(user) && ' ✓'}
                </button>
              ))}
            </div>
          </div>
          <button className="Button Button--primary" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      )}

      <div className="ExpenseSplitter__Content">
        <div className="ExpenseSplitter__ExpensesList">
          <h3>Recent Expenses</h3>
          {expenses.length === 0 ? (
            <div className="Empty">No expenses added yet. Add your first expense to get started.</div>
          ) : (
            <div className="ExpenseSplitter__ExpensesGrid">
              {expenses.map(expense => {
                const perPerson = expense.amount / expense.participants.length;
                return (
                  <div key={expense.id} className="ExpenseCard">
                    <div className="ExpenseCard__Header">
                      <div>
                        <h4>{expense.description}</h4>
                        <p className="Eyebrow">{expense.category}</p>
                      </div>
                      <button className="Button Button--ghost Button--small" onClick={() => deleteExpense(expense.id)}>
                        Delete
                      </button>
                    </div>
                    <div className="ExpenseCard__Body">
                      <div className="ExpenseCard__Amount">
                        <p className="Label">Total</p>
                        <p className="Value">{formatCurrencyWithDecimals(expense.amount)}</p>
                      </div>
                      <div className="ExpenseCard__Split">
                        <p className="Label">Paid by</p>
                        <p className="Value">{expense.paidBy}</p>
                      </div>
                      <div className="ExpenseCard__Split">
                        <p className="Label">Per person</p>
                        <p className="Value">{formatCurrencyWithDecimals(perPerson)}</p>
                      </div>
                      <div className="ExpenseCard__Participants">
                        <p className="Label">Split between:</p>
                        <div className="ExpenseCard__ParticipantsList">
                          {expense.participants.map((p, idx) => (
                            <span key={idx} className="MiniChip">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ExpenseSplitter__BalancesSection">
          <h3>Balances</h3>
          {simplifiedBalances.length === 0 ? (
            <div className="Empty">All settled up! No balances.</div>
          ) : (
            <div className="ExpenseSplitter__BalancesList">
              {simplifiedBalances.map((balance, idx) => (
                <div key={idx} className="BalanceItem">
                  <div className="BalanceItem__Info">
                    <p className="BalanceItem__From">{balance.from}</p>
                    <span className="BalanceItem__Arrow">→</span>
                    <p className="BalanceItem__To">{balance.to}</p>
                  </div>
                  <p className="BalanceItem__Amount">{formatCurrencyWithDecimals(balance.amount)}</p>
                </div>
              ))}
            </div>
          )}
          <div className="ExpenseSplitter__IndividualBalances">
            <h4>Individual Balances</h4>
            {users.map(user => {
              const balance = balances[user] || 0;
              return (
                <div key={user} className="BalanceItem">
                  <p className="BalanceItem__Name">{user}</p>
                  <p className={`BalanceItem__Amount ${balance > 0 ? 'BalanceItem__Amount--positive' : balance < 0 ? 'BalanceItem__Amount--negative' : ''}`}>
                    {balance > 0 ? '+' : ''}{formatCurrencyWithDecimals(balance)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InputModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        title="Add Group Member"
        label="Member Name"
        placeholder="Enter member name"
        submitText="Add"
      />

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Notice"
        message={alertMessage}
        type="warning"
      />
    </section>
  );
}

