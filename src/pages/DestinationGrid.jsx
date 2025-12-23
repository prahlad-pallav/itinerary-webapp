import PropTypes from 'prop-types';
import DestinationCard from '../components/DestinationCard';
import './DestinationGrid.css';

/**
 * Destination grid component
 * @param {Array} destinations - Array of destination objects
 * @param {Function} onAddToPlan - Function to call when adding destination to plan
 */
export default function DestinationGrid({ destinations, onAddToPlan }) {
  return (
    <section id="destinations" className="Grid">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          onAddToPlan={onAddToPlan}
        />
      ))}
    </section>
  );
}

DestinationGrid.propTypes = {
  destinations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired,
  onAddToPlan: PropTypes.func.isRequired
};

