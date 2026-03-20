import styles from './ColorPickerControl.module.css';
import { usePlayground } from '../../context/PlaygroundContext';

const ColorPickerControl = () => {
  const context = usePlayground()
  const value = context.accentColor
  const setValue = context.setAccentColor
  const handleColor = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className={styles.controlGroup}>
      <label className={styles.controlLabel}>Accent Color</label>
      <div className={styles.colorPickerRow}>
        <input 
          className={styles.colorInput} 
          type="color"
          value={value}
          onChange={handleColor}
        />
        <span className={styles.controlValue}>{value.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ColorPickerControl;