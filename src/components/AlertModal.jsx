import PropTypes from 'prop-types';
import Modal from './Modal';
import './AlertModal.css';

/**
 * Alert modal component for displaying messages
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal should close
 * @param {string} title - Modal title
 * @param {string} message - Alert message
 * @param {string} type - Alert type ('info', 'warning', 'error', 'success')
 */
export default function AlertModal({ isOpen, onClose, title, message, type = 'info' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className={`AlertModal AlertModal--${type}`}>
        <p className="AlertModal__Message">{message}</p>
        <div className="AlertModal__Actions">
          <button className="Button Button--primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
}

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'warning', 'error', 'success'])
};

