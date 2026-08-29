import { Link } from 'react-router-dom';
import styles from './animeRow.module.css';

function AnimeRow({ title, seasonBadge, children }) {
  return (
    <section className={styles.rowSection}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>
          {title}
          {seasonBadge && <span className={styles.seasonBadge}>{seasonBadge}</span>}
        </h2>
        <Link to={'/search'} className={styles.rowLink}>
          View all <span className="material-symbols-rounded text-icon">arrow_forward</span>
        </Link>
      </div>
      <div className={styles.animeRowWrap}>
        <div className={styles.animeRow}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default AnimeRow;
