import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import { ITINERARY_TEMPLATE } from '../constants/destinations';
import './TripPlanner.css';

/**
 * Trip planner component
 * @param {Array} plan - Array of planned destinations
 * @param {Function} updateNights - Function to update nights for a destination
 * @param {Function} removeFromPlan - Function to remove destination from plan
 */
export default function TripPlanner({ plan, updateNights, removeFromPlan }) {
  const totalPlanCost = plan.reduce((sum, item) => sum + item.price * item.nights, 0);

  return (
    <section id="plan" className="Plan">
      <div>
        <div className="Plan__Head">
          <div>
            <p className="Pill Pill--dark">Trip builder</p>
            <h2>Your working itinerary</h2>
            <p className="Lede Lede--small">
              Adjust nights, keep budget in check, and export when you are ready.
            </p>
          </div>
          <div className="Budget">
            <p className="Label">Est. total</p>
            <p className="Value Value--large">{formatCurrency(totalPlanCost)}</p>
            <p className="Hint">Flights not included</p>
          </div>
        </div>
        {plan.length === 0 ? (
          <div className="Empty">No destinations added yet. Pick a spot to start.</div>
        ) : (
          <div className="Plan__List">
            {plan.map((item) => (
              <div key={item.id} className="PlanItem">
                <div>
                  <p className="Eyebrow">{item.location}</p>
                  <h3>{item.name}</h3>
                  <p className="Description">{item.description}</p>
                </div>
                <div className="PlanItem__Controls">
                  <div className="Nights">
                    <button onClick={() => updateNights(item.id, -1)}>-</button>
                    <span>{item.nights} nights</span>
                    <button onClick={() => updateNights(item.id, 1)}>+</button>
                  </div>
                  <p className="Label">Subtotal</p>
                  <p className="Value">{formatCurrency(item.price * item.nights)}</p>
                  <button className="Button Button--ghost" onClick={() => removeFromPlan(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <aside className="Itinerary">
        <p className="Pill Pill--dark">5-day template</p>
        <h3>Plug-and-play schedule</h3>
        <p className="Hint">Swap details to match the destination you pick.</p>
        <ul>
          {ITINERARY_TEMPLATE.map((item) => (
            <li key={item.day}>
              <div className="DayCircle">{item.day}</div>
              <div>
                <p className="Label">{item.title}</p>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

TripPlanner.propTypes = {
  plan: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      nights: PropTypes.number.isRequired
    })
  ).isRequired,
  updateNights: PropTypes.func.isRequired,
  removeFromPlan: PropTypes.func.isRequired
};

