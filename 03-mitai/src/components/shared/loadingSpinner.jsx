import styles from './loadingSpinner.module.css';

function LoadingSpinner({ fullPage = false, label = 'Loading' }) {
  return (
    <div className={`${styles.loadingWrap} ${fullPage ? styles.fullPage : ''}`}>
      <span className={styles.spinner} aria-hidden="true"></span>
      <span className={styles.loadingLabel}>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
