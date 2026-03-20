import styles from './TextInputControl.module.css';
import { usePlayground } from '../../context/PlaygroundContext';

const TextInputControl = () => {
  const context = usePlayground()
  const value = context.buttonText
  const setValue = context.setButtonText
  const handleInput = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className={styles.controlGroup}>
      <label className={styles.controlLabel}>Button Text</label>
      <input 
        className={styles.textInput} 
        type="text" 
        value = {value} 
        placeholder="Enter button text..." 
        onChange={handleInput}
      />
    </div>
  );
};

export default TextInputControl;