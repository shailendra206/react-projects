import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__left}>System Version 2.0.4-Beta</div>
      <div className={styles.footer__right}>
        <span className={styles.footer__status}>● Live Connection Stable</span>
        <span>Render Time: 14ms</span>
      </div>
    </footer>
  );
};

export default Footer;