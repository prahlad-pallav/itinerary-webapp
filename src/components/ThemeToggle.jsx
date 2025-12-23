import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button className="ThemeToggle" onClick={handleToggle} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <span className="ThemeToggle__Icon">☀️</span>
      ) : (
        <span className="ThemeToggle__Icon">🌙</span>
      )}
      <span className="ThemeToggle__Label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

