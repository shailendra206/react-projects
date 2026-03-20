import styles from './Header.module.css';
import ThemeToggle from '../theme-toggle/ThemeToggle';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__brand}>
        <div className={styles.header__icon}>
          <span className="material-symbols-outlined">layers</span>
        </div>
        <h1 className={styles.header__title}>NOCTRUS</h1>
      </div>
      <div className={styles.header__actions}>
        <ThemeToggle />
        <div className={styles.header__divider}></div>
        <button className={styles.btnRun}>
          <span className="material-symbols-outlined">play_arrow</span>
          <span className={styles.btnRun__text}>Run Code</span>
        </button>
      </div>
    </header>
  );
};

export default Header;