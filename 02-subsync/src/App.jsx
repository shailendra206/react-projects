import { useEffect, useState } from "react";
import EntryModal from "./components/modals/entryModal";
import Navbar from "./components/shared/navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Subscription from "./components/subscription/Subscription";
import EditPanel from "./components/modals/editPanel";
import Calendar from "./components/calendar/Calendar";
import Toast from './components/shared/Toast'
import { Plus } from 'lucide-react'

function App() {
  const [isDark, setIsDark] = useState(() => JSON.parse(localStorage.getItem('isDark')) || false)
  const [isDashboard, setDashboard] = useState(true)
  const [displaySubscription, setDisplaySubscription] = useState(false)
  const [isCalender, setCalender] = useState(false)
  const [isEntryModal, setEntryModal] = useState(false);
  const [subscription, setSubscription] = useState(() => {
    return JSON.parse(localStorage.getItem('subscription')) || []
  });
  const [sidePanel, setSidePanel] = useState(null);
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  function showToast(message, type = 'success') {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }
  
  const billingCycleShort = {
    Monthly: "/mo",
    Quarterly: "/qtr",
    Yearly: "/yr",
  };

  function addSubscription(data) {
    setSubscription([...subscription, {...data, id: Date.now()}]);
  }

  function updateSubscription(id){
    setSubscription(subscription.map(item => (
      item.id === id ? {...item, isCancelled: true, endsOn: getNextBillingDate(item.startDate, item.billingCycle)} : item
    )))
  }

  function removeSub(id){
    setSubscription(subscription.filter(item => item.id !== id))
  }

  function getNextBillingDate(startDate, billingCycle) {
    const cycleMonths = {
      Monthly: 1,
      Quarterly: 3,
      Yearly: 12,
    };
    const [y, m, d] = startDate.split('-')
    const next = new Date(y, m - 1, d);
    while (next <= new Date()) {
      next.setMonth(next.getMonth() + cycleMonths[billingCycle]);
    }
    return next;
  }

  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(subscription))
    localStorage.setItem('isDark', JSON.stringify(isDark))
  }, [subscription, isDark])

  useEffect(() => {
    isDark
      ? (document.documentElement.dataset.theme = "dark")
      : (document.documentElement.dataset.theme = "");
  }, [isDark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isDashboard, displaySubscription, isCalender]);

  return (
    <>
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        isEntryModal={isEntryModal}
        setEntryModal={setEntryModal}
        
        isDashboard={isDashboard} 
        setDashboard={setDashboard}
        displaySubscription={displaySubscription}
        setDisplaySubscription={setDisplaySubscription}
        isCalender={isCalender} 
        setCalender={setCalender}
        query={query}
        setQuery={setQuery}
      />
      {isDashboard && <Dashboard
          subscription={subscription}
          setSubscription={setSubscription}
          getNextBillingDate={getNextBillingDate}
          goToSubscriptions={() => { setDashboard(false); setDisplaySubscription(true); setCalender(false) }}
          goToCalendar={() => { setDashboard(false); setDisplaySubscription(false); setCalender(true) }}
      />}
      {displaySubscription && <Subscription
        subscription={subscription}
        setSubscription={setSubscription}
        showToast={showToast}
        sidePanel={sidePanel}
        setSidePanel={setSidePanel}
        billingCycleShort={billingCycleShort}
        getNextBillingDate={getNextBillingDate}
        query={query}
        setQuery={setQuery}
      />}
      {isCalender && <Calendar 
        subscription={subscription}
        setSubscription={setSubscription}
        getNextBillingDate={getNextBillingDate}
      />}
      {isEntryModal && (
        <EntryModal
          isEntryModal={isEntryModal}
          setEntryModal={setEntryModal}
          addSubscription={addSubscription}
          showToast={showToast}
        />
      )}
      {sidePanel && (
        <EditPanel
          sidePanel={sidePanel}
          setSidePanel={setSidePanel}
          billingCycleShort={billingCycleShort}
          subscription={subscription}
          getNextBillingDate={getNextBillingDate}
          updateSubscription={updateSubscription}
          removeSub={removeSub}
          showToast={showToast}
        />
      )}
      <Toast toast={toast} />
      <button
        className="floatingAddButton"
        type="button"
        aria-label="Add subscription"
        title="Add subscription"
        onClick={() => setEntryModal(true)}
      >
        <Plus size={26} strokeWidth={2.2} />
      </button>
    </>
  );
}

export default App;
