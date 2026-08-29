import styles from './emptyState.module.css';

function EmptyState({ icon = 'search_off', title, subtitle }) {
  return (
    <div className={styles.empty}>
      <span className={`material-symbols-rounded ${styles.emptyIcon}`}>{icon}</span>
      <h2 className={styles.emptyTitle}>{title}</h2>
      {subtitle && <p className={styles.emptySub}>{subtitle}</p>}
    </div>
  );
}

export default EmptyState;
