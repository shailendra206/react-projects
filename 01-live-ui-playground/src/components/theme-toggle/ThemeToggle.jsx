import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button 
      className={styles.btnIcon} 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className={`material-symbols-outlined ${styles.iconLight}`}>
        dark_mode
      </span>
      <span className={`material-symbols-outlined ${styles.iconDark}`}>
        light_mode
      </span>
    </button>
  );
};

export default ThemeToggle;