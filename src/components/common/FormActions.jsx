import PropTypes from 'prop-types';
import './FormActions.css';

/**
 * Form action buttons container
 * @param {string} align - Alignment of buttons ('left', 'right', 'center', 'space-between')
 * @param {ReactNode} children - Action buttons
 */
export default function FormActions({ align = 'right', children }) {
  return <div className={`FormActions FormActions--${align}`}>{children}</div>;
}

FormActions.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center', 'space-between']),
  children: PropTypes.node.isRequired
};

