import {
  BadgeIndianRupee,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Moon,
  Plus,
  Search,
  Sun,
  Bell
} from "lucide-react";
import styles from "./navbar.module.css";
import { useState } from "react";

function Navbar({ isDark, setIsDark, isEntryModal, setEntryModal, isDashboard, setDashboard, displaySubscription, setDisplaySubscription, isCalender, setCalender, query, setQuery}) {
  const [isSearchOverlay, setIsSearchOverlay] = useState(false)
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoDot}></span>
          <span className={styles.brand}>SubSync</span>
        </div>

        <nav className={styles.navLinks}>
          <button
            className={`${styles.navLink} ${isDashboard ? styles.active : ''}`}
            type="button"
            onClick={() => {
              setDashboard(true)
              setDisplaySubscription(false)
              setCalender(false)
            }}
          >
            Dashboard
          </button>
          <button className={`${styles.navLink} ${displaySubscription ? styles.active : ''}`} type="button"
            onClick={() => {
              setDashboard(false)
              setDisplaySubscription(true)
              setCalender(false)
            }}
          >
            Subscriptions
          </button>
          <button className={`${styles.navLink} ${isCalender ? styles.active : ''}`} type="button"
            onClick={() => {
              setDashboard(false)
              setDisplaySubscription(false)
              setCalender(true)
            }}
          >
            Calendar
          </button>
        </nav>

        <div className={styles.actions}>
          <label className={styles.searchBox}>
            <Search className={styles.searchIcon} size={15} strokeWidth={1.8} />
            <input
              id="search-input"
              type="text"
              placeholder="Search subscriptions..."
              onChange={(e) => {
                if(e.target.value === '') {
                  setQuery('')
                  return
                }
                setQuery(e.target.value)
                setDashboard(false)
                setDisplaySubscription(true)
                setCalender(false)
              }}
            />
          </label>

          <button
            className={`${styles.iconButton} ${styles.mobileSearchButton}`}
            id="mobile-search-btn"
            type="button"
            title="Search"
            aria-label="Search subscriptions"
            onClick={() => {setIsSearchOverlay(true)}}
          >
            <Search size={16} strokeWidth={1.8} />
          </button>

          <button className={styles.themeToggle} type="button"
            onClick={() => {setIsDark(!isDark)}}
          >
            <span className={styles.themeIcon}>
              <Sun size={14} strokeWidth={1.8} />
            </span>
            <span className={styles.themeIcon}>
              <Moon size={13} strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </header>

      <nav className={styles.mobileBottomNav}>
        <button
          className={`${styles.mobileNavTab} ${isDashboard ? styles.mobileActive : ''}`}
          type="button"
          onClick={() => {
            setDashboard(true)
            setDisplaySubscription(false)
            setCalender(false)
          }}
        >
          <LayoutDashboard size={20} strokeWidth={1.8} />
          <span>Dashboard</span>
        </button>
        <button className={`${styles.mobileNavTab} ${displaySubscription ? styles.mobileActive : ''}`} type="button"
          onClick={() => {
            setDashboard(false)
            setDisplaySubscription(true)
            setCalender(false)
          }}
        >
          <BadgeIndianRupee size={20} strokeWidth={1.8} />
          <span>Subscription</span>
        </button>
        <button className={`${styles.mobileNavTab} ${isCalender ? styles.mobileActive : ''}`} type="button"
          onClick={() => {
            setDashboard(false)
            setDisplaySubscription(false)
            setCalender(true)
          }}
        >
          <CalendarDays size={20} strokeWidth={1.8} />
          <span>Calender</span>
        </button>
        <button
          className={`${styles.mobileNavTab} ${styles.mobileAddTab}`}
          type="button"
          onClick={() => {setEntryModal(!isEntryModal)}}
        >
          <span className={styles.mobileAddIcon}>
            <Plus size={20} strokeWidth={2.2} />
          </span>
        </button>
      </nav>

      {/* Mobile Search Overlay */}
      <div className={`${styles.mobileSearchOverlay} ${isSearchOverlay ? styles.mobileSearchOpen : ''}`} id="mobile-search-overlay">
        <div className={styles.mobileSearchBar}>
          <Search size={16} strokeWidth={1.8} className={styles.searchIcon} />
          <input
            id="mobile-search-input"
            type="text"
            placeholder="Search subscriptions..."
            className={styles.mobileSearchInput}
            id="mobile-search-overlay"
            onChange={(e) => {
              if(e.target.value === '') {
                setQuery('')
                return
              }
              setQuery(e.target.value)
              setDashboard(false)
              setDisplaySubscription(true)
              setCalender(false)
            }}
          />
          <button
            type="button"
            className={styles.mobileSearchClose}
            onClick={() => {
              setIsSearchOverlay(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
