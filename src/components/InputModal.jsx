import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './InputModal.css';

/**
 * Input modal component for text input
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal should close
 * @param {Function} onSubmit - Function to call with input value
 * @param {string} title - Modal title
 * @param {string} label - Input label
 * @param {string} placeholder - Input placeholder
 * @param {string} submitText - Submit button text
 */
export default function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  submitText = 'Submit'
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      setError('This field is required');
      return;
    }

    if (trimmedValue.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    onSubmit(trimmedValue);
    setValue('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setValue('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="small">
      <form onSubmit={handleSubmit} className="InputModal__Form">
        <div className="InputModal__Group">
          <label className="InputModal__Label">{label}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
            placeholder={placeholder}
            className={`InputModal__Input ${error ? 'InputModal__Input--error' : ''}`}
            autoFocus
          />
          {error && <p className="InputModal__Error">{error}</p>}
        </div>
        <div className="InputModal__Actions">
          <button
            type="button"
            className="Button Button--ghost"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button type="submit" className="Button Button--primary">
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
}

InputModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  submitText: PropTypes.string
};

