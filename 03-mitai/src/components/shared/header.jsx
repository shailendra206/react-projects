import { useState, useEffect } from 'react';
import Watchlist from '../watchlist/watchlist';
import styles from './header.module.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  function openSearch() {
    setSearchOpen(true);
    document.body.classList.add('search-open');
  }

  function closeSearch() {
    setSearchOpen(false);
    document.body.classList.remove('search-open');
  }

  const [isLight, setIsLight] = useState(() => localStorage.getItem('theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  function toggleTheme() {
    setIsLight(prev => !prev);
  }

  return (
    <nav className={styles.navbar}>
      <Link className={styles.logo} to={'/'}>
        <span className={styles.logoJp}>見たい</span>
        <span className={styles.logoEn}>Mitai</span>
      </Link>

      <div className={styles.navSearch}>
        <span className="material-symbols-rounded nav-icon" aria-hidden="true">search</span>
        <input type="text" placeholder="Search anime, genres, studios..." 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') {
            navigate( `/search?search=${encodeURIComponent(searchValue)}` )
            closeSearch()
            setSearchValue('')
          } }}  
        />
        <button className={styles.searchClose} type="button" aria-label="Close search" onClick={closeSearch}>
          <span className="material-symbols-rounded nav-icon" aria-hidden="true">close</span>
        </button>
      </div>

      <div className={styles.navLinks}>
        <NavLink className={({isActive}) => `${styles.navIconBtn} ${styles.navBrowseBtn} ${isActive ? styles.navIconBtnActive : ''}`} title="Browse" aria-label="Browse" to={'search'}>
          <span className="material-symbols-rounded nav-icon" aria-hidden="true">filter_alt</span>
        </NavLink>
        <NavLink className={({isActive}) => `${styles.navIconBtn} ${styles.navWatchlist} ${isActive ? styles.navIconBtnActive : ''}`} title="Watchlist" aria-label="Watchlist" to={'watchlist'}>
          <span className="material-symbols-rounded nav-icon" aria-hidden="true">bookmark</span>
        </NavLink>
        <button className={`${styles.navIconBtn} ${styles.mobileSearchToggle}`} type="button" aria-label="Open search" onClick={openSearch}>
          <span className="material-symbols-rounded nav-icon" aria-hidden="true">search</span>
        </button>
        <button className={`${styles.navIconBtn} ${styles.themeToggle}`} type="button" title="Toggle theme" aria-label="Toggle theme" onClick={toggleTheme}>
          <span className={`material-symbols-rounded nav-icon ${styles.iconSun}`} aria-hidden="true">light_mode</span>
          <span className={`material-symbols-rounded nav-icon ${styles.iconMoon}`} aria-hidden="true">dark_mode</span>
        </button>
      </div>
    </nav>
  );
}

export default Header;
