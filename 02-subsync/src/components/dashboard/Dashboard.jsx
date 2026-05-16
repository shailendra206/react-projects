import { Check, Clock, Plus, CreditCard, BarChart2, RefreshCw, Clapperboard, Tv2, Wrench, HeartPulse, BadgeIndianRupee, HardDrive, LayoutGrid } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./Dashboard.module.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,107,26,0.3)', borderRadius: '8px', padding: '8px 12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#FF6B1A', fontSize: '16px', fontWeight: 800 }}>₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const categoryIconMap = {
  Entertainment: { Icon: Clapperboard, color: 'var(--cat-entertainment)' },
  Streaming:     { Icon: Tv2,      color: 'var(--cat-streaming)' },
  Tools:         { Icon: Wrench,   color: 'var(--cat-tools)' },
  Health:        { Icon: HeartPulse, color: 'var(--cat-health)' },
  Finance:       { Icon: BadgeIndianRupee, color: 'var(--cat-finance)' },
  Storage:       { Icon: HardDrive, color: 'var(--cat-storage)' },
  Other:         { Icon: LayoutGrid, color: 'var(--cat-other)' },
}

const cycleMonths = { Monthly: 1, Quarterly: 3, Yearly: 12 }

function getChartData(subscription) {
  if (!subscription || subscription.length === 0) return []
  const now = new Date()
  const result = []
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const activeSubs = subscription.filter(item => new Date(item.startDate) <= month && (!item.isCancelled || new Date(item.endsOn) >= month))
    const spend = activeSubs.reduce((total, item) => total + (item.amount / cycleMonths[item.billingCycle]), 0)
    result.push({ month: month.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }), spend: Math.round(spend * 100) / 100 })
  }
  return result
}

function getYearSpent(subscription) {
  const currentDate = new Date()
  const yearOldDate = new Date()
  yearOldDate.setFullYear(currentDate.getFullYear() - 1)
  let total = 0
  subscription.forEach(item => {
    if (item.isCancelled || item.isTrial) return
    const billingDate = new Date(item.startDate.split('-')[0], item.startDate.split('-')[1] - 1, item.startDate.split('-')[2])
    while (billingDate <= currentDate) {
      if (billingDate >= yearOldDate) total += Number(item.amount)
      billingDate.setMonth(billingDate.getMonth() + cycleMonths[item.billingCycle])
    }
  })
  return Math.round(total * 100) / 100
}

function getMonthlySpent(subscription) {
  let total = 0
  subscription.forEach(item => {
    if (item.isCancelled || item.isTrial) return
    total += item.amount / cycleMonths[item.billingCycle]
  })
  return Math.round(total * 100) / 100
}

function getActiveSubsLength(subscription) {
  return subscription.filter(item => !item.isCancelled && !item.isTrial).length
}

function getTrialSubsLength(subscription) {
  return subscription.filter(item => item.isTrial).length
}

function getCategorySpent(subscription) {
  const data = { Entertainment: 0, Streaming: 0, Tools: 0, Health: 0, Finance: 0, Storage: 0, Other: 0 }
  subscription.forEach(item => {
    if (item.isCancelled || item.isTrial) return
    if (data[item.category] !== undefined) data[item.category] += Number(item.amount)
    else data.Other += Number(item.amount)
  })
  return Object.entries(data).filter(([_, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 4)
}

function getRenewalStatus(startDate) {
  const start = new Date(startDate)
  const billingDay = new Date(startDate).getDate()
  const today = new Date()
  const billingDate = new Date(today.getFullYear(), today.getMonth(), billingDay)
  const daysUntil = Math.ceil((billingDate - today) / (1000 * 60 * 60 * 24))
  if(start.getDate() === today.getDate() && start.getMonth() === today.getMonth() && start.getFullYear() === today.getFullYear()) return "CONFIRMED"
  if (daysUntil < 0) return "CONFIRMED"
  if (daysUntil <= 3) return "SOON"
  return "PENDING"
}

function getNewSubsLength(subscription) {
  const now = new Date()
  return subscription.filter(item => {
    if (item.isCancelled || item.isTrial) return false
    const start = new Date(item.startDate)
    return start.getFullYear() === now.getFullYear() && start.getMonth() === now.getMonth()
  }).length
}

function getNextRenewal(subscription, getNextBillingDate) {
  const dates = subscription
    .filter(item => !item.isCancelled && !item.isTrial)
    .map(item => getNextBillingDate(item.startDate, item.billingCycle))
    .sort((a, b) => a - b)
  return dates[0]
}

const iconMap = { 'credit-card': CreditCard, 'chart-bar': BarChart2, 'rotate': RefreshCw, 'clock': Clock }

const emptyState = (icon, text, dark) => {
  const Icon = iconMap[icon]
  return (
    <div className={styles.emptyStateWrap}>
      <div className={styles.emptyStateIcon}>
        <Icon size={18} color="#ff6b1a" />
      </div>
      <span className={`${styles.emptyStateText} ${dark ? styles.emptyStateTextDark : ''}`}>{text}</span>
    </div>
  )
}

function Dashboard({ subscription, setSubscription, getNextBillingDate, goToSubscriptions, goToCalendar }) {
  const categoryColorMap = {
    Entertainment: 'var(--cat-entertainment)',
    Streaming: 'var(--cat-streaming)',
    Tools: 'var(--cat-tools)',
    Health: 'var(--cat-health)',
    Finance: 'var(--cat-finance)',
    Storage: 'var(--cat-storage)',
    Other: 'var(--cat-other)',
  }
  const activeSubs = subscription.filter(i => !i.isCancelled && !i.isTrial)
  const trialSubs = subscription.filter(i => i.isTrial)
  const categoryData = getCategorySpent(subscription)

  return (
    <section className={styles.dashboard}>
      <div className={styles.breadcrumb}>
        <span>SUBSYNC</span>
        <span>/</span>
        <span className={styles.activeCrumb}>DASHBOARD</span>
      </div>

      <div className={styles.bentoGrid}>

        {/* Card 1 — Monthly Burn Chart */}
        <div className={`${styles.card} ${styles.darkCard} ${styles.wideCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>MONTHLY BURN</span>
            <h2 className={styles.monthlyBurn}>₹{getMonthlySpent(subscription)}<span>/mo</span></h2>
          </div>
          <div className={styles.chartWrap}>
            {activeSubs.length > 0
              ? (
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={getChartData(subscription)} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B1A" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#FF6B1A" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,107,26,0.2)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="spend" stroke="#FF6B1A" strokeWidth={2} fill="url(#spendGrad)" dot={{ fill: '#FF6B1A', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#FF6B1A', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )
              : emptyState('chart-bar', 'No burn data yet', true)
            }
          </div>
        </div>

        {/* Card 2 — Health Score */}
        <div className={`${styles.card} ${styles.orangeCard}`}>
          <span className={styles.orangeLabel}>HEALTH SCORE</span>
          <h2>Your Financial<br />Vitality Pulse</h2>
          <div className={styles.orangeShape}></div>
          <div className={styles.orangeActions}>
            <button type="button" onClick={goToSubscriptions}><span>Manage Subscription</span><Check size={14} /></button>
            <button type="button" onClick={goToCalendar}><span>Upcoming Renewals</span><Clock size={14} /></button>
          </div>
        </div>

        {/* Card 3 — Yearly Spend */}
        <div className={`${styles.card} ${styles.lightCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.label}>LIFESTYLE SPEND (YEARLY)</span>
          </div>
          <h2 className={styles.yearlySpend}>₹{getYearSpent(subscription)}</h2>
          <div className={styles.dotMatrix}>
            <p><span></span><span></span><span></span><span></span><span></span><span></span></p>
            <p><span></span><span></span><span></span><span></span><span></span></p>
            <p><span></span><span></span><span></span><span></span></p>
            <p><span></span><span></span><span></span></p>
          </div>
          <div className={styles.miniStats}>
            <p><span>MONTHLY AVG</span><strong>₹{Math.round((getYearSpent(subscription) / 12) * 100) / 100}</strong></p>
            <p><span>ACTIVE SUBS</span><strong>{getActiveSubsLength(subscription)}</strong></p>
          </div>
        </div>

        {/* Card 4 — Active Subscriptions */}
        <div className={`${styles.card} ${styles.darkCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.whiteTitle}>Active Subscriptions</h3>
            <button className={styles.viewAll} type="button" onClick={goToSubscriptions}>VIEW ALL</button>
          </div>
          <div className={`${styles.subList} ${activeSubs.length > 0 ? styles.subListHasItems : ''}`}>
            {activeSubs.length > 0
              ? activeSubs.map(item => (
                <div key={item.id}>
                  <div style={{ display: 'grid', placeItems: 'center', width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-dark-2)', flexShrink: 0 }}>
                    {(() => { const { Icon, color } = categoryIconMap[item.category] || categoryIconMap.Other; return <Icon size={14} color={color} strokeWidth={2} /> })()}
                  </div>
                  <p><strong>{item.serviceName}</strong><small>Renews: {getNextBillingDate(item.startDate, item.billingCycle).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</small></p>
                  <b>₹{Number(item.amount).toFixed(2)}</b><i></i>
                </div>
              ))
              : emptyState('credit-card', 'No active subscriptions', true)
            }
          </div>
          <div className={styles.forecast}>
            <span>FORECAST</span>
            <strong>₹{Math.round(getMonthlySpent(subscription) * 12 * 100) / 100}<small>/yr</small></strong>
          </div>
        </div>

        {/* Card 5 — Spend by Category */}
        <div className={`${styles.card} ${styles.lightCard}`}>
          <div className={styles.inlineTitle}><i></i><h3>Spend by Category</h3></div>
          <div className={styles.categoryBars}>
            {categoryData.length > 0
              ? categoryData.map((item, index) => (
                <div key={index}>
                  <p><span>{item[0]}</span><strong>₹{Number(item[1]).toFixed(2)}</strong></p>
                  <b style={{ background: categoryColorMap[item[0]] || 'var(--cat-other)' }}></b>
                </div>
              ))
              : emptyState('chart-bar', 'No spending data yet', false)
            }
          </div>
          {categoryData.length > 0 && (
            <div className={styles.exposure}>
              <span>TOP EXPOSURE</span>
              <strong>{categoryData[0][0]}</strong>
            </div>
          )}
        </div>

        {/* Card 6 — Renewals */}
        <div className={`${styles.card} ${styles.lightCard}`}>
          <div className={styles.cardHeader}>
            <p><span className={styles.label}>RENEWALS</span><strong className={styles.renewals}>₹{getMonthlySpent(subscription)}<span>/mo</span></strong></p>
            <span className={styles.orangeBadgeSmall}>+{getNewSubsLength(subscription)} NEW</span>
          </div>
          <div className={styles.renewalList}>
            {activeSubs.length > 0
              ? activeSubs.slice(0, 3).map(item => (
                <p key={item.id}><i className={styles.greenDot}></i><span>{item.serviceName}</span><strong>{getRenewalStatus(item.startDate)}</strong></p>
              ))
              : emptyState('rotate', 'No renewals this month', false)
            }
          </div>
        </div>

        {/* Card 7 — Trial Endings */}
        <div className={`${styles.card} ${styles.darkCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.whiteTitle}>Trial Endings</h3>
            <span className={styles.amberBadge}>{getTrialSubsLength(subscription)} ACTIVE</span>
          </div>
          <div className={`${styles.trialList} ${trialSubs.length > 0 ? styles.trialListHasItems : ''}`}>
            {trialSubs.length > 0
              ? trialSubs.slice(0, 2).map(item => (
                <div key={item.id}>
                  <p><strong>{item.serviceName}</strong><small>Ends- {new Date(item.trialEnds).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' })} -₹{item.priceAfterTrial}/mo after</small></p>
                  <div><button type="button" onClick={() => {
                        const dayAfterTrial = new Date(item.trialEnds)
                        dayAfterTrial.setDate(dayAfterTrial.getDate() + 1)
                        const newStartDate = dayAfterTrial.toISOString().split('T')[0]
                        setSubscription(subscription.map(sub =>
                          sub.id === item.id ? {...sub, amount: item.priceAfterTrial, isTrial: false, startDate: newStartDate, trialEnds: null, priceAfterTrial: null} : sub
                        ))
                      }}>Keep</button><button type="button">Cancel</button></div>
                </div>
              ))
              : emptyState('clock', 'No active trials', true)
            }
          </div>
          <button className={styles.trialsBtn} style={{marginTop: '12px'}} type="button" onClick={goToSubscriptions}><Clock size={13} /> View All Trials</button>
        </div>

        {/* Card 8 — This Month */}
        <div className={`${styles.card} ${styles.lightCard}`}>
          <span className={styles.label}>THIS MONTH</span>
          <div className={styles.quickStats}>
            <p><span>MONTHLY SPEND</span><strong>₹{getMonthlySpent(subscription)}</strong></p>
            <p><span>NEXT RENEWAL</span><strong>{getNextRenewal(subscription, getNextBillingDate) ? getNextRenewal(subscription, getNextBillingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" }) : '—'}</strong></p>
            <p><span>TRIALS ENDING</span><strong className={styles.amberText}>{getTrialSubsLength(subscription)}</strong></p>
            <p><span>ACTIVE SUBS</span><strong>{getActiveSubsLength(subscription)}</strong></p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Dashboard;
