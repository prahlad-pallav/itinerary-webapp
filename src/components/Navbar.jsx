import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    // Only handle smooth scroll if we're on the home page
    if (location.pathname !== '/') {
      e.preventDefault();
      // Navigate to home first, then scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

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

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="Navbar">
      <div className="Navbar__Container">
        <div className="Navbar__Brand">
          <Link to="/" className="Navbar__BrandLink">
            <h2>✈️ Vacation Planner</h2>
          </Link>
        </div>
        <div className="Navbar__Right">
          <ul className="Navbar__Menu">
            <li className="Navbar__MenuItem">
              <Link
                to="/"
                className={`Navbar__MenuLink ${isActive('/') ? 'Navbar__MenuLink--active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li className="Navbar__MenuItem">
              <a
                href="#destinations"
                className="Navbar__MenuLink"
                onClick={(e) => handleNavClick(e, 'destinations')}
              >
                Destinations
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a
                href="#weather"
                className="Navbar__MenuLink"
                onClick={(e) => handleNavClick(e, 'weather')}
              >
                Weather
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a
                href="#plan"
                className="Navbar__MenuLink"
                onClick={(e) => handleNavClick(e, 'plan')}
              >
                My Plan
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <a
                href="#expenses"
                className="Navbar__MenuLink"
                onClick={(e) => handleNavClick(e, 'expenses')}
              >
                Expenses
              </a>
            </li>
            <li className="Navbar__MenuItem">
              <Link
                to="/packing"
                className={`Navbar__MenuLink ${isActive('/packing') ? 'Navbar__MenuLink--active' : ''}`}
              >
                Packing
              </Link>
            </li>
            <li className="Navbar__MenuItem">
              <Link
                to="/calendar"
                className={`Navbar__MenuLink ${isActive('/calendar') ? 'Navbar__MenuLink--active' : ''}`}
              >
                Calendar
              </Link>
            </li>
            <li className="Navbar__MenuItem">
              <Link
                to="/flights-hotels"
                className={`Navbar__MenuLink ${isActive('/flights-hotels') ? 'Navbar__MenuLink--active' : ''}`}
              >
                Flights & Hotels
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
