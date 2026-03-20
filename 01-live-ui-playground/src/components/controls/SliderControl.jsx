import styles from './SliderControl.module.css';
import { usePlayground } from '../../context/PlaygroundContext';

const SliderControl = ({name, label, min, max}) => {
  const context = usePlayground()
  const value = context[name]
  const setterName = 'set' + name[0].toUpperCase() + name.slice(1)
  const setValue = context[setterName]
  const percentage = (((value - min) / (max - min)) * 100)

  const handleSlider = (e) => {
    setValue(Number(e.target.value))
  }

  return (
    <div className={styles.controlGroup}>
      <div className={styles.controlGroup__header}>
        <label className={styles.controlLabel}>{label}</label>
        <span className={styles.controlValue}>{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className={styles.slider}
        onChange={handleSlider}
        style={{'--percentage' : `${percentage}%`}}
      />
    </div>
  );
};

export default SliderControl;