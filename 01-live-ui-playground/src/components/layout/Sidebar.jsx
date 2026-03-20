import styles from './Sidebar.module.css';
import SliderControl from '../controls/SliderControl';
import ButtonGroupControl from '../controls/ButtonGroupControl';
import TextInputControl from '../controls/TextInputControl';
import ColorPickerControl from '../controls/ColorPickerControl';
import { usePlayground } from '../../context/PlaygroundContext';

const Sidebar = () => {
  const context = usePlayground()
  const handleResetBtn = () => {
    context.setBorderRadius(4)
    context.setShadow('LG')
    context.setFontSize(13)
    context.setButtonText('Get Starting now')
    context.setAccentColor('')
    context.setPadding(14)
  }
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__inner}>
        <div className={styles.sidebar__controls}>
          
          <SliderControl 
            name = "borderRadius"
            label="Border Radius"
            min = {0}
            max = {24}
          />
          
          <ButtonGroupControl />
          
          <SliderControl 
            name = "fontSize"
            label = "Font Size"
            min = {12}
            max = {32}
          />
          
          <TextInputControl />
          
          <ColorPickerControl />
          
          <SliderControl 
            name = "padding"
            label = "Padding"
            min = {8}
            max = {64}
          />
          
        </div>
      </div>

      <div className={styles.sidebar__footer}>
        <button className={styles.btnReset} onClick={handleResetBtn}>
          <span className="material-symbols-outlined">refresh</span>
          Reset View
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;