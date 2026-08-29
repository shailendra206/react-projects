import styles from './footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLogo}>見たい <em>Mitai</em></div>
        <p className={styles.footerTagline}>Discover what to watch next.</p>
        <p className={styles.footerCredit}>Data powered by AniList · Built by Shailendra Goswami</p>
      </div>
    </footer>
  );
}

export default Footer;
