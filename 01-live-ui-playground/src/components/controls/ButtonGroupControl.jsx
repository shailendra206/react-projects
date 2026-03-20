import styles from './ButtonGroupControl.module.css';
import { usePlayground } from '../../context/PlaygroundContext';

const ButtonGroupControl = () => {
  const context = usePlayground()
  const value = context.shadow
  const setValue = context.setShadow
  const handleButton = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className={styles.controlGroup}>
      <div className={styles.controlGroup__header}>
        <label className={styles.controlLabel}>Shadow Intensity</label>
        <span className={styles.controlValue}>{value}</span>
      </div>
      <div className={styles.buttonGrid}>
        <button className={`${styles.btnOption} ${value === 'NONE' ? styles.active : ''}`} 
          value='NONE'
          onClick={handleButton}
        >NONE</button>
        <button className={`${styles.btnOption} ${value === 'SM' ? styles.active : ''}`} 
          value='SM'
          onClick={handleButton}
        >SM</button>
        <button className={`${styles.btnOption} ${value === 'MD' ? styles.active : ''}`} 
          value='MD'
          onClick={handleButton}
        >MD</button>
        <button className={`${styles.btnOption} ${value === 'LG' ? styles.active : ''}`} 
          value='LG'
          onClick={handleButton}
        >LG</button>
      </div>
    </div>
  );
};

export default ButtonGroupControl;