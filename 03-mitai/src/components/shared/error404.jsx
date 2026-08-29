import styles from './error404.module.css';
import { Link } from 'react-router-dom';

function Error404() {
  return (
    <div className={styles.error}>
      <span className={`material-symbols-rounded ${styles.errorIcon}`}>travel_explore</span>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorTitle}>Page not found</h2>
      <p className={styles.errorSub}>The page you're looking for doesn't exist or may have been moved.</p>
      <Link className="btn-primary" to="/">
        <span className="material-symbols-rounded button-icon" aria-hidden="true">home</span>
        Back to Home
      </Link>
    </div>
  );
}

export default Error404;
