import PropTypes from 'prop-types';
import './SectionHeader.css';

/**
 * Reusable section header component
 * @param {string} pill - Pill/badge text
 * @param {string} title - Main heading
 * @param {string} description - Description text
 * @param {ReactNode} children - Additional content (e.g., action buttons, stats)
 * @param {boolean} darkPill - Whether to use dark pill variant
 */
export default function SectionHeader({ pill, title, description, children, darkPill = true }) {
  return (
    <div className="SectionHeader">
      <div>
        {pill && <p className={`Pill ${darkPill ? 'Pill--dark' : ''}`}>{pill}</p>}
        {title && <h2>{title}</h2>}
        {description && <p className="Lede Lede--small">{description}</p>}
      </div>
      {children && <div className="SectionHeader__Actions">{children}</div>}
    </div>
  );
}

SectionHeader.propTypes = {
  pill: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  darkPill: PropTypes.bool
};

