import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export function WatchlistProvider({children}){
    const [watchlistArr, setWatchlistArr] = useState(() => {
        const stored = localStorage.getItem('watchlist');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
    }, [watchlistArr]);

    function toggleWatchlistArr(id){
        setWatchlistArr(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    return(
        <WatchlistContext.Provider value={{watchlistArr, toggleWatchlistArr}}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist(){
    return useContext(WatchlistContext)
}