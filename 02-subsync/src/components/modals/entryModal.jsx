import { ChevronDown, X } from "lucide-react";
import styles from "./entryModal.module.css";
import { useState } from "react";

function EntryModal({ isEntryModal, setEntryModal, addSubscription, showToast }) {
  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "Entertainment",
    amount: "",
    billingCycle: "Monthly",
    isTrial: false,
    trialEnds: localDate,
    priceAfterTrial: "",
    accentColor: "indigo",
    startDate: localDate,
    isCancelled: false
  })

  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!formData.serviceName.trim()) e.serviceName = true
    if (!formData.isTrial && !formData.amount) e.amount = true
    if (formData.isTrial && !formData.priceAfterTrial) e.priceAfterTrial = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Add Subscription</h3>
          <button className={styles.closeButton} type="button" onClick={() => setEntryModal(false)}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <form className={styles.form}>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>SERVICE NAME</label>
            <div className={styles.inputWithDot}>
              <span className={styles.inputColorDot}></span>
              <input
                className={`${styles.formInput} ${errors.serviceName ? styles.inputError : ''}`}
                type="text"
                placeholder="e.g. Netflix"
                onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>CATEGORY</label>
              <div className={styles.selectWrap}>
                <select className={styles.formSelect} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Entertainment</option>
                  <option>Streaming</option>
                  <option>Tools</option>
                  <option>Health</option>
                  <option>Finance</option>
                  <option>Storage</option>
                  <option>Other</option>
                </select>
                <ChevronDown className={styles.selectIcon} size={16} strokeWidth={1.8} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ACCENT COLOR</label>
              <div className={styles.colorSwatches}>
                {['purple','red','blue','green','amber','teal','indigo'].map(color => (
                  <button
                    key={color}
                    className={`${styles.colorSwatch} ${styles[color + 'Swatch']} ${formData.accentColor === color ? styles.selected : ''}`}
                    type="button"
                    onClick={() => setFormData({...formData, accentColor: color})}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>AMOUNT</label>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.inputPrefix}>&#8377;</span>
                <input
                  className={`${styles.formInput} ${styles.hasPrefix} ${errors.amount ? styles.inputError : ''}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>BILLING CYCLE</label>
              <div className={styles.selectWrap}>
                <select className={styles.formSelect} onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
                <ChevronDown className={styles.selectIcon} size={16} strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>START DATE</label>
            <input
              className={styles.formInput}
              type="date"
              max={localDate}
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleCopy}>
              <span className={styles.formLabel}>Free Trial?</span>
              <span className={styles.formHint}>Remind me before it ends</span>
            </div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                onChange={(e) => setFormData({...formData, isTrial: e.target.checked, amount: e.target.checked ? '' : formData.amount})}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={`${styles.trialFields} ${formData.isTrial ? styles.trialFieldsVisible : ''}`}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>TRIAL ENDS</label>
                <input
                  className={styles.formInput}
                  type="date"
                  min={localDate}
                  defaultValue={localDate}
                  onChange={(e) => setFormData({...formData, trialEnds: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>PRICE AFTER TRIAL</label>
                <div className={styles.inputPrefixWrap}>
                  <span className={styles.inputPrefix}>&#8377;</span>
                  <input
                    className={`${styles.formInput} ${styles.hasPrefix} ${errors.priceAfterTrial ? styles.inputError : ''}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="14.99"
                    onChange={(e) => setFormData({...formData, priceAfterTrial: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.cancelButton} type="button" onClick={() => setEntryModal(false)}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="button"
              onClick={() => {
                if (!validate()) return
                addSubscription(formData)
                showToast('Subscription added')
                setEntryModal(false)
              }}
            >
              Add Subscription
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EntryModal;
