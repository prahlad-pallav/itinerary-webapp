import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import './HeroSection.css';

/**
 * Hero section component
 * @param {Object} featuredDestination - Featured destination to display
 */
export default function HeroSection({ featuredDestination }) {
  return (
    <header className="Hero">
      <div>
        <p className="Pill">Vacation app · React + JS</p>
        <h1>Plan your next escape with confidence.</h1>
        <p className="Lede">
          Curated destinations, ready-to-use itineraries, and a simple planner to keep
          budget, vibes, and must-do experiences aligned.
        </p>
        <div className="Hero__Actions">
          <button className="Button Button--primary">Start a plan</button>
          <button className="Button Button--ghost">Explore featured</button>
        </div>
        <div className="Hero__MetaRow">
          <span>Instant filters</span>
          <span>Budget snapshot</span>
          <span>Copy-ready itineraries</span>
        </div>
      </div>
      <div className="HeroCard">
        <p className="Pill Pill--dark">This week's pick</p>
        <h3>{featuredDestination.name}</h3>
        <p>{featuredDestination.description}</p>
        <div className="HeroCard__StatRow">
          <div>
            <p className="Label">Starting</p>
            <p className="Value">{formatCurrency(featuredDestination.price)}</p>
          </div>
          <div>
            <p className="Label">Rating</p>
            <p className="Value">{featuredDestination.rating}</p>
          </div>
          <div>
            <p className="Label">Nights</p>
            <p className="Value">5-7</p>
          </div>
        </div>
      </div>
    </header>
  );
}

HeroSection.propTypes = {
  featuredDestination: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired
  }).isRequired
};

