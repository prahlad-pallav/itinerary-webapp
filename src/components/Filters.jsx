import PropTypes from 'prop-types';
import { TAGS } from '../constants/destinations';
import './Filters.css';

/**
 * Filters component for destination filtering and sorting
 * @param {string} search - Current search value
 * @param {Function} setSearch - Function to update search
 * @param {string} tag - Current selected tag
 * @param {Function} setTag - Function to update tag
 * @param {string} sort - Current sort value
 * @param {Function} setSort - Function to update sort
 */
export default function Filters({ search, setSearch, tag, setTag, sort, setSort }) {
  return (
    <section className="Filters">
      <div className="InputGroup">
        <label>Search destinations</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city, region, or vibe"
        />
      </div>
      <div className="InputGroup">
        <label>Filter by tag</label>
        <div className="Chips">
          {TAGS.map((t) => (
            <button
              key={t}
              className={`Chip ${tag === t ? 'Chip--active' : ''}`}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="InputGroup InputGroup--compact">
        <label>Sort</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price">Price (low first)</option>
          <option value="rating">Rating (high first)</option>
        </select>
      </div>
    </section>
  );
}

Filters.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
  setTag: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired
};

