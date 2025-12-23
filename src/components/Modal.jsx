import PropTypes from 'prop-types';
import './Modal.css';

/**
 * Modal component for displaying dialogs
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal should close
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size ('small', 'medium', 'large')
 */
export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="Modal__Backdrop" onClick={handleBackdropClick}>
      <div className={`Modal Modal--${size}`}>
        <div className="Modal__Header">
          <h3 className="Modal__Title">{title}</h3>
          <button
            className="Modal__CloseButton"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="Modal__Body">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

