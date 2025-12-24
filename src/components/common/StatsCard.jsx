import PropTypes from 'prop-types';
import './StatsCard.css';

/**
 * Reusable stats card component
 * @param {string} label - Stat label
 * @param {string|number} value - Stat value
 * @param {boolean} large - Whether to use large value size
 * @param {string} className - Additional CSS classes
 */
export default function StatsCard({ label, value, large = false, className = '' }) {
  return (
    <div className={`StatsCard ${className}`}>
      <p className="Label">{label}</p>
      <p className={`Value ${large ? 'Value--large' : ''}`}>{value}</p>
    </div>
  );
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  large: PropTypes.bool,
  className: PropTypes.string
};

