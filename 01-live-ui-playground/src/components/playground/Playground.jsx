import styles from "./Playground.module.css";
import { usePlayground } from "../../context/PlaygroundContext";
const Playground = () => {
  const context = usePlayground();
  const shadowMap = {
    NONE: "none",
    SM: "0 2px 8px rgba(0,0,0,0.1)",
    MD: "0 4px 16px rgba(0,0,0,0.15)",
    LG: "0 8px 30px rgba(0,0,0,0.2)",
  };
  return (
    <section className={styles.playground}>
      <div className={styles.previewArea}>
        <div className={styles.previewCard}>
          <button
            className={styles.previewCard__btn}
            style={{
              borderRadius: context.borderRadius,
              fontSize: context.fontSize,
              padding: context.padding,
              backgroundColor: context.accentColor,
              boxShadow: shadowMap[context.shadow]
            }}
          >
            {context.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Playground;
