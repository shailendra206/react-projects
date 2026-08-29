import styles from './relatedTitleCard.module.css';

function RelatedTitleCard({ img, alt, type, title }) {
  return (
    <div className={styles.relationCard}>
      <div className={styles.relationImgWrap}>
        <img src={img} alt={alt} loading="lazy" />
        <span className={styles.relationType}>{type}</span>
      </div>
      <p className={styles.relationTitle}>{title}</p>
    </div>
  );
}

export default RelatedTitleCard;
