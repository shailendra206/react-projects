import styles from "./CodePanel.module.css";
import { usePlayground } from "../../context/PlaygroundContext";
import { useState } from "react";
const CodePanel = () => {
  const context = usePlayground();
  const [activeTab, setActiveTab] = useState("tailwind");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const code = activeTab === "tailwind" ? generateTailwind() : generateCSS();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = (e) => {
    setActiveTab(e.target.value);
  };

  const shadowValues = {
    NONE: "none",
    SM: "0 2px 8px rgba(0,0,0,0.1)",
    MD: "0 4px 16px rgba(0,0,0,0.15)",
    LG: "0 8px 30px rgba(0,0,0,0.2)",
  };

  const generateTailwind = () => {
    return `<button class="rounded-[${context.borderRadius}px] shadow-${context.shadow.toLowerCase()} text-[${context.fontSize}px] p-${Math.round(context.padding / 4)}" style="background-color: ${context.accentColor}">
  ${context.buttonText}
</button>`;
  };

  const generateCSS = () => {
    return `<button style="border-radius: ${context.borderRadius}px; box-shadow: ${shadowValues[context.shadow]}; font-size: ${context.fontSize}px; padding: ${context.padding}px 2.5rem; background-color: ${context.accentColor}; color: var(--bg); border: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer;">
  ${context.buttonText}
</button>`;
  };

  return (
    <div className={styles.codePanel}>
      <div className={styles.codePanel__header}>
        <div className={styles.codePanel__tabs}>
          <button
            className={`${styles.codeTab} ${activeTab === "tailwind" ? styles.active : ""}`}
            value="tailwind"
            onClick={handleClick}
          >
            Tailwind CSS
          </button>
          <button
            className={`${styles.codeTab} ${activeTab === "css" ? styles.active : ""}`}
            value="css"
            onClick={handleClick}
          >
            Raw CSS
          </button>
        </div>
        <button className={styles.btnCopy} onClick={copyCode}>
          <span className="material-symbols-outlined">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span className={styles.btnCopy__text}>
            {copied ? 'Copied!' : 'Copy Code'}
          </span>
        </button>
      </div>
      <div className={styles.codePanel__body}>
        <pre className={styles.codeBlock}>
          {activeTab === "tailwind" ? generateTailwind() : generateCSS()}
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
