import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import './DestinationCard.css';

/**
 * Destination card component
 * @param {Object} destination - Destination object
 * @param {Function} onAddToPlan - Function to call when adding to plan
 */
export default function DestinationCard({ destination, onAddToPlan }) {
  return (
    <article className="Card">
      <div
        className="Card__Image"
        style={{ backgroundImage: `url(${destination.image})` }}
        role="presentation"
      />
      <div className="Card__Body">
        <div className="Card__Head">
          <div>
            <p className="Eyebrow">{destination.location}</p>
            <h3>{destination.name}</h3>
          </div>
          <span className="Rating">★ {destination.rating}</span>
        </div>
        <p className="Description">{destination.description}</p>
        <div className="Card__TagRow">
          {destination.tags.map((t) => (
            <span key={t} className="MiniChip">
              {t}
            </span>
          ))}
        </div>
        <div className="Card__Footer">
          <div>
            <p className="Label">From</p>
            <p className="Value">{formatCurrency(destination.price)}</p>
          </div>
          <button className="Button Button--primary" onClick={() => onAddToPlan(destination)}>
            Add to plan
          </button>
        </div>
      </div>
    </article>
  );
}

DestinationCard.propTypes = {
  destination: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onAddToPlan: PropTypes.func.isRequired
};

