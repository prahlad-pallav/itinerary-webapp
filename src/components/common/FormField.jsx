import PropTypes from 'prop-types';
import './FormField.css';

/**
 * Reusable form field component
 * @param {string} label - Field label
 * @param {string} type - Input type (text, number, date, email, etc.)
 * @param {string} name - Input name attribute
 * @param {any} value - Input value
 * @param {Function} onChange - Change handler
 * @param {string} placeholder - Input placeholder
 * @param {string} error - Error message to display
 * @param {boolean} required - Whether field is required
 * @param {ReactNode} children - Custom input element (for select, textarea, etc.)
 * @param {object} inputProps - Additional props to pass to input
 */
export default function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  children,
  ...inputProps
}) {
  return (
    <div className="FormField">
      {label && (
        <label htmlFor={name} className="FormField__Label">
          {label}
          {required && <span className="FormField__Required">*</span>}
        </label>
      )}
      {children || (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`FormField__Input ${error ? 'FormField__Input--error' : ''}`}
          {...inputProps}
        />
      )}
      {error && <span className="FormField__Error">{error}</span>}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  inputProps: PropTypes.object
};

