import { X, Clapperboard, Tv2, Wrench, HeartPulse, BadgeIndianRupee, HardDrive, LayoutGrid } from "lucide-react";
import styles from "./editPanel.module.css";

const categoryIconMap = {
  Entertainment: { Icon: Clapperboard, color: 'var(--cat-entertainment)' },
  Streaming:     { Icon: Tv2,      color: 'var(--cat-streaming)' },
  Tools:         { Icon: Wrench,   color: 'var(--cat-tools)' },
  Health:        { Icon: HeartPulse, color: 'var(--cat-health)' },
  Finance:       { Icon: BadgeIndianRupee, color: 'var(--cat-finance)' },
  Storage:       { Icon: HardDrive, color: 'var(--cat-storage)' },
  Other:         { Icon: LayoutGrid, color: 'var(--cat-other)' },
}

function EditPanel({sidePanel, setSidePanel, billingCycleShort, getNextBillingDate, updateSubscription, removeSub, showToast}) {
  const endDate = sidePanel.isCancelled ? new Date(sidePanel.endsOn) : new Date()
  function getDuration(date){
    const startDate = new Date(date)
    const currentDate = new Date()
    if(startDate > currentDate)
      return `STARTS IN: ${Math.round((startDate - currentDate) / (1000 * 60 * 60 * 24))} Days`
    let years = currentDate.getFullYear() - startDate.getFullYear()
    let months = currentDate.getMonth() - startDate.getMonth()
    let days = currentDate.getDate() - startDate.getDate()
    
    if (months < 0){
      years -= 1
      months += 12 
    }

    if (days < 0){
      months -= 1
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
      days += lastMonth.getDate()
    }

    let joinedStr = ''
    if(years > 0)
      joinedStr = `JOINED SINCE: ${years > 1 ? year + ' years ' : year + ' year '}`
    else if(months > 0)
      joinedStr = `JOINED SINCE: ${months > 1 ? months + ' months ' : months + ' month '}`
    else if(days > 0)
      joinedStr = `JOINED SINCE: ${days > 1 ? days + ' days ' : days + ' day '}` 
    else
      joinedStr = 'Just started'
    console.log("startDate:", date, "parsed:", new Date(date))
    return joinedStr
  }

  function getTotalSpent(amount, billingCycle, startDate){
    const cycleMonths = {Monthly: 1, Quarterly: 3, Yearly: 12}
    const start = new Date(startDate)
    const now = new Date()
    const monthDiff = ((now.getFullYear() - start.getFullYear()) * 12) + now.getMonth() - start.getMonth()
    const cycle = Math.floor(monthDiff / cycleMonths[billingCycle]) + 1
    return Math.round(cycle * amount * 100) / 100
  }

  return (
    <>
      <div className={styles.modalOverlay}></div>

      <div className={styles.editModal}>
        <div className={styles.header}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar} style={{ background: 'var(--bg)' }}>
              {(() => { const { Icon, color } = categoryIconMap[sidePanel.category] || categoryIconMap.Other; return <Icon size={18} color={color} strokeWidth={2} /> })()}
            </div>
            <div>
              <span className={styles.name}>{sidePanel.serviceName}</span>
              <span className={styles.category}>{sidePanel.category}</span>
            </div>
          </div>

          <button className={styles.closeButton} type="button"
            onClick={() => setSidePanel(null)}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.amountRow}>
          <span className={styles.amount}>₹{sidePanel.amount}</span>
          <span className={styles.cycle}>{billingCycleShort[sidePanel.billingCycle]}</span>
        </div>

        <div className={styles.usageBadge}>
          {sidePanel.isCancelled 
            ? `will be Cancelled on: ${sidePanel.endsOn.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            : `${getDuration(sidePanel.startDate)}`
          }
        </div>

        <div className={styles.meta}>
          {sidePanel.isCancelled ? '' 
            : <div className={styles.metaRow}>
              <span>Next Billing</span>
              <span>{getNextBillingDate(sidePanel.startDate, sidePanel.billingCycle).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</span>
            </div>
          }
          <div className={styles.metaRow}>
            <span>Total Spent</span>
            <span>₹{getTotalSpent(sidePanel.amount, sidePanel.billingCycle, sidePanel.startDate)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {/* <button className={styles.saveButton} type="button"
            onClick={() => setSidePanel(null)}
          >
            Save Changes
          </button> */}
          <button className={styles.cancelButton} type="button"
            onClick={() => {
              updateSubscription(sidePanel.id)
              showToast('Subscription cancelled', 'warning')
              setSidePanel(null)
            }}
          >
            Cancel Subscription
          </button>
          <button className={styles.deleteButton} type="button"
            onClick={() => {
              removeSub(sidePanel.id)
              setSidePanel(null)
            }}
          >
            DELETE RECORD PERMANENTLY
          </button>
        </div>
      </div>
    </>
  );
}

export default EditPanel;
