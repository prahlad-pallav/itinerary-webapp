import PropTypes from 'prop-types';
import './FormGrid.css';

/**
 * Grid layout for form fields
 * @param {number} columns - Number of columns (default: auto-fit)
 * @param {string} minWidth - Minimum width for each column
 * @param {ReactNode} children - Form fields to display in grid
 */
export default function FormGrid({ columns, minWidth = '200px', children }) {
  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : { gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))` };

  return (
    <div className="FormGrid" style={gridStyle}>
      {children}
    </div>
  );
}

FormGrid.propTypes = {
  columns: PropTypes.number,
  minWidth: PropTypes.string,
  children: PropTypes.node.isRequired
};

