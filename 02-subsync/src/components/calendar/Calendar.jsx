import { useState } from "react";
import { BadgeIndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Calendar.module.css";

function Calendar({ subscription, setSubscription, getNextBillingDate}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const today = new Date();
  const accentColors = {
    blue: "#3B82F6",
    green: "#22C55E",
    indigo: "#6366F1",
    red: "#EF4444",
    amber: "#F59E0B",
    purple: "#8B5CF6",
    teal: "#14B8A6",
    cyan: "#06B6D4",
    gray: "#6B7280",
  };
  const cycleMonths = {Monthly: 1, Quarterly: 3, Yearly: 12}
  const [selectedDay, setSelectedDay] = useState(null)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const events = getCalendarEvents(currentMonth, currentYear)

  function getCalendarEvents(month, year){
    const events = {}
    subscription.forEach(item => {
      if(item.isCancelled) return

      const start = new Date(item.startDate.split('-')[0], item.startDate.split('-')[1] - 1, item.startDate.split('-')[2])
      const monthDiff = (year - start.getFullYear())*12 + (month - start.getMonth())
      if(monthDiff % cycleMonths[item.billingCycle] !== 0) return
      const billingDate = item.isTrial
        ? new Date(item.trialEnds.split('-')[0], item.trialEnds.split('-')[1] - 1, item.trialEnds.split('-')[2])
        : new Date(year, month, start.getDate())
      
      if(!item.isTrial && billingDate < new Date(start.getFullYear(), start.getMonth(), start.getDate())) return
    
      if(billingDate.getMonth() === month && billingDate.getFullYear() === year){
        const day = billingDate.getDate()
        if(!events[day]) events[day] = []
        events[day].push({name: item.serviceName, color: accentColors[item.accentColor], amount: item.isTrial ? item.priceAfterTrial : item.amount, isTrial: item.isTrial})
      }
    })
    return events
  }
  

  function getCalendarDays(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, otherMonth: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, otherMonth: false });
    }

    return days;
  }

  function getLeftDays(endsOn){
    const today = new Date()
    today.setHours(0,0,0,0)
    const [ey, em, ed] = endsOn.split('-')
    const date = new Date(ey, em - 1, ed)
    const diff = date - today //ms
    const days = diff / (1000 * 60 * 60 * 24)
    return Math.ceil(days)
  }

  function getTrialProgress(startDate, endsOn) {
    const [sy, sm, sd] = startDate.split('-')
    const start = new Date(sy, sm - 1, sd)
    start.setHours(0, 0, 0, 0)
    const [ey2, em2, ed2] = endsOn.split('-')
    const total = Math.ceil((new Date(ey2, em2 - 1, ed2) - start) / (1000 * 60 * 60 * 24))
    const left = getLeftDays(endsOn)
    const used = total - left
    return Math.round((used / total) * 100)
  }

  function getTotalSpent(amount){
    const activeSubs = subscription.filter(item => !item.isCancelled && !item.isTrial)
    let totalAmount = 0
    activeSubs.forEach(item => {totalAmount = totalAmount + Number(item.amount)})
    return totalAmount
  }

  return (
    <section className={styles.calendarPage} 
      onClick={() => setSelectedDay(null)}
    >
      <div className={styles.breadcrumb}>
        <span>SUBSYNC</span>
        <span>/</span>
        <span className={styles.activeCrumb}>CALENDAR</span>
      </div>

      <div className={styles.calendarLayout}>
        <div className={styles.calendarMain}>
          <div className={styles.calendarHeader}>
            <h1 className={styles.monthTitle}>{new Date(currentYear, currentMonth).toLocaleDateString("en-IN", { month: "long", timeZone: "Asia/Kolkata" })} {currentYear}</h1>

            <div className={styles.calendarNav}>
              <button className={styles.navButton} type="button"
                onClick={() => {
                  if(currentMonth === 0){
                    setCurrentMonth(11)
                    setCurrentYear(currentYear - 1)
                  }else{
                    setCurrentMonth(currentMonth - 1)
                  }
                }}
              >
                <ChevronLeft size={16} strokeWidth={1.8} />
              </button>
              <button className={styles.navButton} type="button"
                onClick={() => {
                  if(currentMonth === 11){
                    setCurrentMonth(0)
                    setCurrentYear(currentYear + 1)
                  }else{
                    setCurrentMonth(currentMonth + 1)
                  }
                }}
              >
                <ChevronRight size={16} strokeWidth={1.8} />
              </button>
            </div>

            <button className={styles.todayButton} type="button"
              onClick={() => {
                setCurrentMonth(new Date().getMonth())
                setCurrentYear(new Date().getFullYear())
              }}
            >
              Today
            </button>
          </div>

          <div className={styles.calendarGrid}>
            <div className={styles.dayHeader}>Sun</div>
            <div className={styles.dayHeader}>Mon</div>
            <div className={styles.dayHeader}>Tue</div>
            <div className={styles.dayHeader}>Wed</div>
            <div className={styles.dayHeader}>Thu</div>
            <div className={styles.dayHeader}>Fri</div>
            <div className={styles.dayHeader}>Sat</div>

            {getCalendarDays(currentMonth, currentYear).map((item, index) => {
              const dayEvents = events[item.day] || []
              return (
              <div
                key={index}
                className={`${styles.calendarCell} ${item.otherMonth ? styles.otherMonth : ""} 
                ${item.day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? styles.today : ""}
                ${dayEvents.length > 0 ? styles.hasEvents : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if(dayEvents.length > 0) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const parentRect = e.currentTarget.closest('.' + styles.calendarMain).getBoundingClientRect()
                    setPopoverPos({
                      top: rect.bottom - parentRect.top + 4,
                      left: Math.max(0, Math.min(rect.left - parentRect.left, parentRect.width - 290))
                    })
                    setSelectedDay(item.day)
                  }
                }}
              >
                <span>{item.day}</span>
                <div className={styles.dots}>
                  {dayEvents.map((obj, i) => (<i key={i} style={{ background: obj.color }}></i>))}
                </div>
              </div>
            )})}
          </div>

            {/* Calendar-pop-over */}
          {selectedDay && events[selectedDay] && (
            <div className={styles.calendarPopover} style={{ top: popoverPos.top, left: popoverPos.left }}>
              <div className={styles.popoverHeader}>
                <span className={styles.popoverDate}>{new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</span>
                <span className={styles.popoverTotal}>₹{events[selectedDay].reduce((t, ev) => t + Number(ev.amount), 0).toFixed(2)}</span>
              </div>
              <div className={styles.popoverItems}>
                {events[selectedDay].map((item, i) => (
                  <div key={i} className={styles.popoverItem}>
                    <span className={styles.popoverDot} style={{ background: item.color }}></span>
                    <span className={styles.popoverName}>{item.name}</span>
                    {item.isTrial && <span className={styles.popoverBadge}>ENDS</span>}
                    {item.isTrial ? <span className={styles.popoverPrice}>₹{Number(item.amount).toFixed(2)}</span> : <span className={styles.popoverPrice}>₹{Number(item.amount).toFixed(2)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className={styles.calendarSidebar}>
          <div className={`${styles.sideCard} ${styles.darkCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>{new Date(currentYear, currentMonth).toLocaleDateString("en-IN", { month: "long", timeZone: "Asia/Kolkata" }).toUpperCase()}</span>
            </div>

            <strong className={styles.monthAmount}>₹{Number(getTotalSpent(subscription)).toFixed(2)}</strong>
            <div className={styles.summaryList}>
              {subscription.filter(item => !item.isCancelled).length > 0
                ? subscription.map((item) => (
                  !item.isTrial ? 
                    <div className={styles.summaryItem} key={item.id}>
                      <i className={styles.summaryDot} style={{background: accentColors[item.accentColor] }}></i>
                      <span>{item.serviceName}</span>
                      <small>
                        {getNextBillingDate(item.startDate, item.billingCycle).getDate() <= 9 ? `0${getNextBillingDate(item.startDate, item.billingCycle).getDate()}` : getNextBillingDate(item.startDate, item.billingCycle).getDate()}
                      </small>
                      <b>₹{Number(item.amount).toFixed(2)}</b>
                    </div>
                  : <div className={styles.summaryItem} key={item.id}>
                      <i className={styles.summaryDot} style={{background: accentColors[item.accentColor] }}></i>
                      <span>{item.serviceName}</span>
                      <small>
                        {new Date(item.trialEnds.split('-')[0], item.trialEnds.split('-')[1] - 1, item.trialEnds.split('-')[2]).getDate()}
                      </small>
                      <em> ENDS </em>
                      <b>₹{Number(item.priceAfterTrial).toFixed(2)}</b>
                    </div>
                ))
                : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <BadgeIndianRupee size={20} strokeWidth={1.8} />
                    </div>
                    <span>No renewals yet</span>
                  </div>
                )
              }
            </div>
          </div>

          {subscription.filter(item => item.isTrial).length > 0 ? <div className={`${styles.sideCard} ${styles.lightCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>TRIAL ENDINGS</span>
            </div>

            
            {subscription.map(item => (item.isTrial ? 
              <div className={styles.trialItem}>
              <div className={styles.trialTop}>
                <span
                  className={styles.trialAvatar}
                  style={{ background: accentColors[item.accentColor] }}
                >
                  {item.serviceName.charAt(0).toUpperCase()}
                </span>
                <p>
                  <strong>{item.serviceName}</strong>
                  <small>{getLeftDays(item.trialEnds)} days remaining</small>
                </p>
                {/* {getLeftDays(item.endsOn)}  */}
                <div className={styles.trialActions}>
                  <button type="button" onClick={() => {
                    setSubscription(subscription.map(sub =>
                      sub.id === item.id ? {...sub, isCancelled: true, endsOn: getNextBillingDate(item.startDate, item.billingCycle)} : sub
                    ))
                  }}>Cancel</button>
                  <button type="button" onClick={() => {
                    const dayAfterTrial = new Date(item.trialEnds)
                    dayAfterTrial.setDate(dayAfterTrial.getDate() + 1)
                    const newStartDate = `${dayAfterTrial.getFullYear()}-${String(dayAfterTrial.getMonth()+1).padStart(2,'0')}-${String(dayAfterTrial.getDate()).padStart(2,'0')}`
                    setSubscription(subscription.map(sub =>
                      sub.id === item.id ? {...sub, isTrial: false, amount: item.priceAfterTrial, startDate: newStartDate, trialEnds: null, priceAfterTrial: null} : sub
                    ))
                  }}>Keep</button>
                </div>
              </div>
              <div className={styles.progressBar}>
                <span
                  style={{
                    width: `${getTrialProgress(item.startDate, item.trialEnds)}%`,
                    background: accentColors[item.accentColor],
                  }}
                ></span>
              </div>
            </div>: ''
            ))}
          </div> : ''}
        </aside>
      </div>
    </section>
  );
}

export default Calendar;
