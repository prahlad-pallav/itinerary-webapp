import PropTypes from 'prop-types';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="Navbar">
      <div className="Navbar__Container">
        <div className="Navbar__Brand">
          <h2>✈️ Vacation Planner</h2>
        </div>
        <div className="Navbar__Right">
          <ul className="Navbar__Menu">
            <li className="Navbar__MenuItem">
              <a href="#destinations" className="Navbar__MenuLink" onClick={(e) => handleNavClick(e, 'destinations')}>
                Destinations
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a href="#weather" className="Navbar__MenuLink" onClick={(e) => handleNavClick(e, 'weather')}>
                Weather
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a href="#plan" className="Navbar__MenuLink" onClick={(e) => handleNavClick(e, 'plan')}>
                My Plan
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a href="#expenses" className="Navbar__MenuLink" onClick={(e) => handleNavClick(e, 'expenses')}>
                Expenses
              </a>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  // Component doesn't receive props currently, but ready for future use
};

