import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { useContext } from 'react'
import { WatchlistProvider } from './context/watchlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <WatchlistProvider>
    <App/>
  </WatchlistProvider>
)
