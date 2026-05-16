import {
  BadgeIndianRupee,
  CalendarClock,
  Clapperboard,
  CreditCard,
  Edit3,
  FileText,
  HardDrive,
  HeartPulse,
  LayoutGrid,
  ListChecks,
  MoreVertical,
  PackageCheck,
  ReceiptText,
  Repeat,
  RefreshCw,
  SlidersHorizontal,
  Tv2,
  Wrench,
  X,
} from "lucide-react";
import styles from "./Subscription.module.css";
import { useState } from "react";

const categoryIconMap = {
  Entertainment: { Icon: Clapperboard, color: 'var(--cat-entertainment)' },
  Streaming:     { Icon: Tv2,      color: 'var(--cat-streaming)' },
  Tools:         { Icon: Wrench,   color: 'var(--cat-tools)' },
  Health:        { Icon: HeartPulse, color: 'var(--cat-health)' },
  Finance:       { Icon: BadgeIndianRupee, color: 'var(--cat-finance)' },
  Storage:       { Icon: HardDrive, color: 'var(--cat-storage)' },
  Other:         { Icon: LayoutGrid, color: 'var(--cat-other)' },
}

const CategoryAvatar = ({ category }) => {
  const { Icon, color } = categoryIconMap[category] || categoryIconMap.Other
  return (
    <div className={styles.avatar} style={{ background: 'var(--bg)' }}>
      <Icon size={18} color={color} strokeWidth={2} />
    </div>
  )
}

function Subscription({subscription, setSubscription, sidePanel, setSidePanel, billingCycleShort, getNextBillingDate, query, setQuery, showToast}) {

  const [activeFilter, setActiveFilter] = useState('All')
  const [sortByBilling, setSortByBilling] = useState(false)

  const allCount = subscription.filter(item => !item.isCancelled).length
  const activeCount = subscription.filter(item => !item.isCancelled && !item.isTrial).length
  const trialCount = subscription.filter(item => item.isTrial && !item.isCancelled).length
  const cancelledCount = subscription.filter(item => item.isCancelled).length

  const filterSubs = subscription.filter(item => {
    if(activeFilter === 'All') return item
    if(activeFilter === 'Active') return !item.isCancelled && !item.isTrial
    if(activeFilter === 'Trials') return item.isTrial && !item.isCancelled
    if(activeFilter === 'Cancelled') return item.isCancelled
  })

  const filteredSubs = sortByBilling
    ? filterSubs
        .filter(item => item.serviceName.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          if(a.isCancelled || b.isCancelled) return 0
          return getNextBillingDate(a.startDate, a.billingCycle) - getNextBillingDate(b.startDate, b.billingCycle)
        })
    : filterSubs.filter(item => item.serviceName.toLowerCase().includes(query.toLowerCase()))

  const emptyMessages = {
    All: 'No subscriptions yet',
    Active: 'No active subscriptions',
    Trials: 'No trial subscriptions',
    Cancelled: 'No cancelled subscriptions',
  }
  
  return (
    <section className={styles.subscriptionPage}>
      <div className={styles.breadcrumb}>
        <span>SUBSYNC</span>
        <span>/</span>
        <span className={styles.activeCrumb}>SUBSCRIPTIONS</span>
      </div>

      <h1 className={styles.pageTitle}>Manage Vitality</h1>

      <div className={styles.controls}>
        <div className={styles.filterPills}>
          <button className={`${styles.filterPill} ${activeFilter === 'All' ? styles.active : ''}`} type="button"
            onClick={() => setActiveFilter('All')}
          >All ({allCount})</button>
          <button className={`${styles.filterPill} ${activeFilter === 'Active' ? styles.active : ''}`} type="button"
            onClick={() => setActiveFilter('Active')}
          >Active ({activeCount})</button>
          <button className={`${styles.filterPill} ${activeFilter === 'Trials' ? styles.active : ''}`} type="button"
            onClick={() => setActiveFilter('Trials')}
          >Trials ({trialCount})</button>
          <button className={`${styles.filterPill} ${activeFilter === 'Cancelled' ? styles.active : ''}`} type="button"
            onClick={() => setActiveFilter('Cancelled')}
          >Cancelled ({cancelledCount})</button>
        </div>

        <div className={styles.controlButtons}>
          <button className={`${styles.toolButton} ${sortByBilling ? styles.active : ''}`} type="button" onClick={() => setSortByBilling(!sortByBilling)}><SlidersHorizontal size={13} />Sort: Next Billing</button>
        </div>
      </div>

      <div className={styles.rows}>
        {filteredSubs.filter(item => !item.isCancelled).length > 0
          ? filteredSubs.map(item => (
            !item.isCancelled
            ? <div key={item.id} className={`${styles.subRow} ${item.isTrial ? styles.trialRow : ''}`}>
            <span className={styles.accent} style={{ background: `var(--${item.accentColor})`}}></span>
            {/* logo */}
            <CategoryAvatar category={item.category} />
            {/* serviveName */}
            <div className={styles.info}><span>{item.serviceName}</span><small>{item.category}</small></div>
            {/* card upper part */}
            <div className={styles.billing}>
              {item.isTrial
                ? <>
                    <strong>FREE <span>then ₹{item.priceAfterTrial}/mo</span></strong><small className={styles.trialEnd}>Ends: {new Date(item.trialEnds).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</small>
                  </> 
                : <>
                    <strong>₹{item.amount.toFixed ? Number(item.amount).toFixed(2) : item.amount}<span>{billingCycleShort[item.billingCycle]}</span></strong><small>Next: {getNextBillingDate(item.startDate, item.billingCycle).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</small>
                  </>
              }
            </div>
            {/* card lower left part */}
            <div className={styles.badges}>
              {item.isTrial 
                ? <span className={styles.trialBadge}>TRIAL</span>
                : <span className={styles.activeBadge}>ACTIVE</span>
              }
            </div> 
            {/* card lower right part */}
            <div className={styles.actions}>
              {item.isTrial
                ? <>
                    <button className={styles.upgradeButton} type="button"
                      onClick={() => {
                        const dayAfterTrial = new Date(item.trialEnds)
                        dayAfterTrial.setDate(dayAfterTrial.getDate() + 1)
                        const newStartDate = dayAfterTrial.toISOString().split('T')[0]

                        setSubscription(subscription.map(sub => 
                          sub.id === item.id ? {...sub, amount: item.priceAfterTrial, isTrial: false, startDate: newStartDate, trialEnds: null, priceAfterTrial: null} : sub
                        ))
                        showToast('Trial upgraded')
                      }}
                    >UPGRADE</button>
                  </>
                : <>
                    <button type="button" 
                      onClick={() => setSidePanel(item)}
                    ><Edit3 size={13} /></ button>
                  </>
              }
              </div>
            </div>
            : ''
        ))
          : null
        }

        {filteredSubs.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BadgeIndianRupee size={20} strokeWidth={1.8} />
            </div>
            <span>{emptyMessages[activeFilter]}</span>
          </div>
        )}
      </div>

    {cancelledCount > 0 && (activeFilter === 'All' || activeFilter === 'Cancelled') &&
      <div className={styles.cancelledSection}>
        <div className={styles.sectionDivider}><span>Cancelled</span></div>
        
          {filteredSubs.map( item => (
            item.isCancelled ? 
            <div key={item.id} className={`${styles.subRow} ${styles.cancelled}`}>
              <span className={`${styles.accent} ${styles.gray}`}></span>
              <CategoryAvatar category={item.category} />
              <div className={styles.info}><span>{item.serviceName}</span><small>{item.category}</small></div>
              <div className={styles.billing}><strong>₹{Number(item.amount).toFixed(2)}<span>{billingCycleShort[item.billingCycle]}</span></strong>
              <small>
                {new Date(item.endsOn) > new Date() 
                  ? `Ends on: ${new Date(item.endsOn).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}`
                  : `Ended on: ${new Date(item.endsOn).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}`} 
              </small></div>
              <div className={styles.badges}><span className={styles.inactiveBadge}>INACTIVE</span></div>
              <div className={styles.actions}>
                <button type="button" 
                  onClick={() => setSidePanel(item)}
                ><Edit3 size={13}/></ button>
                <button className={styles.reactivateButton} type="button"
                  onClick={() => {
                    setSubscription(
                      subscription.map(subItem => (subItem.id === item.id ? {...subItem, isCancelled: false, endsOn: null} : subItem))
                    )
                    showToast('Subscription reactivated')
                  }}
                >REACTIVATE</button></div>
            </div> 
            : ''
        ))}
    </div>}

    </section>
  );
}

export default Subscription;
