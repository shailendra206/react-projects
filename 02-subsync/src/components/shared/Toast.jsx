import styles from './Toast.module.css'

function Toast({ toast }) {
  if (!toast.visible) return null

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${!toast.visible ? styles.exit : ''}`}>
        <span className={`${styles.toastDot} ${styles[toast.type || 'success']}`}></span>
        {toast.message}
      </div>
    </div>
  )
}

export default Toast
