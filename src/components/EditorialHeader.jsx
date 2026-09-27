import { Link } from 'react-router-dom';

/**
 * Reusable Telegraph India style Category Navigation Header
 */
export default function EditorialHeader() {
  const categories = [
    { name: 'HOME', path: '/' },
    { name: 'OPINION', path: '/' },
    { name: 'INDIA', path: '/' },
    { name: 'WEST BENGAL', path: '/' },
    { name: 'WORLD', path: '/' },
    { name: 'TECH', path: '/explore' },
    { name: 'CITIES', path: '/' },
    { name: 'BUSINESS', path: '/' },
    { name: 'SPORTS', path: '/' },
  ];

  return (
    <header className="editorial-header">
      <nav className="category-nav-bar" aria-label="News categories">
        <ul className="category-nav-list">
          {categories.map((cat, idx) => (
            <li key={idx} className="category-nav-item">
              <Link to={cat.path} className={`category-nav-link ${cat.name === 'TECH' ? 'is-active' : ''}`}>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
