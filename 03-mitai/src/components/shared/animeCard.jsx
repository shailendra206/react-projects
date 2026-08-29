import styles from './animeCard.module.css';
import { useWatchlist } from '../../context/watchlistContext';
import { Link } from 'react-router-dom';

const statusMap = {
  RELEASING:        { label: 'Airing',   dot: styles.dotAiring },
  FINISHED:          { label: 'Finished', dot: styles.dotFinished },
  NOT_YET_RELEASED:  { label: 'Upcoming', dot: styles.dotUpcoming },
};

function AnimeCard({id, img, alt, title, sub, score, airing}) {
  const status = statusMap[airing];
  const {watchlistArr, toggleWatchlistArr} = useWatchlist()
  const isSaved = watchlistArr.includes(id)
  return (
    <div className={styles.animeCard}>
      <div className={styles.cardImgWrap}>
        <Link to={`/info/${id}`}>
          <img src={img} loading="lazy" alt={alt} />
        </Link>
        <div className={styles.cardHover}>
          <span className={styles.cardScore}>
            <span className="material-symbols-rounded rating-icon">star</span>
            {score}
          </span>
          <button className={`${styles.cardSave} ${isSaved ? styles.cardSaveActive : ''}`} onClick={() => toggleWatchlistArr(id)}>
            <span className="material-symbols-rounded save-icon">
              {isSaved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
        {status && (
          <span className={styles.cardAiring}>
            <span className={`${styles.cardStatusDot} ${status.dot}`}></span>
            {status.label}
          </span>
        )}
      </div>
      <Link to={`/info/${id}`} className={styles.cardTitle}>{title}</Link>
      <span className={styles.cardSub}>{sub}</span>
    </div>
  );
}

export default AnimeCard;
