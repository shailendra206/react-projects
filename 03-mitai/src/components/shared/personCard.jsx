import styles from './personCard.module.css';

function PersonCard({ img, alt, name, role, va }) {
  return (
    <div className={styles.personCard}>
      <div className={styles.personImgWrap}>
        <img src={img} alt={alt} loading="lazy" />
      </div>
      <p className={styles.personName}>{name}</p>
      {role && <p className={styles.personRole}>{role}</p>}
      {va && <p className={styles.personVa}>{va}</p>}
    </div>
  );
}

export default PersonCard;
