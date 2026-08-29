import styles from './watchlist.module.css';
import AnimeCard from '../shared/animeCard.jsx';
import LoadingSpinner from '../shared/loadingSpinner.jsx';
import EmptyState from '../shared/emptyState.jsx';
import { useEffect, useState } from 'react';
import { useWatchlist } from '../../context/watchlistContext.jsx';

function Watchlist() {

  const {watchlistArr} = useWatchlist()
  const [animeList, setAnimeList] = useState(null)
  const [pageInfo, setPageInfo] = useState(null)
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(watchlistArr.length / 14)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const query = `
    query($id: [Int], $page: Int){
      Page(page: $page, perPage: 14){
        media(id_in: $id, type: ANIME){
          id
          title{
            romaji
          }
          coverImage{
            extraLarge
          }
          format
          episodes
          status
          averageScore
        }
      }
    }
  `
  const URL = 'https://graphql.anilist.co'

  async function getWatchlistData(id, page){
    const variables = {id, page}
    const res = await fetch(URL, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json', Accept: 'application/json'}, 
      body: JSON.stringify({query, variables})
    })
    const data = await res.json()
    if(data.errors){
      console.log(data.errors)
      return null
    }
    return data.data.Page
  }

  useEffect(() => {
    if(watchlistArr.length === 0){
      return
    }
    getWatchlistData(watchlistArr, page).then(data => { 
      if(!data) return
      setAnimeList(data.media)
      setPageInfo(data.pageInfo)
    })
  }, [watchlistArr, page])

  if(watchlistArr.length > 0 && !animeList) return <LoadingSpinner fullPage/>;

  const filteredList = (animeList || []).filter(item => (
    item.title.romaji.toLowerCase().includes(search.toLowerCase())
  ))

  const sortedList = [...filteredList].sort((a, b) => {
    if(sortBy === 'title') return a.title.romaji.localeCompare(b.title.romaji)
    if(sortBy === 'score') return (b.averageScore || 0) - (a.averageScore || 0)
    return 0
  })

  return (
    <div className={styles.watchlistPage}>

      {/* TOOLBAR */}
      <div className={styles.wlToolbarSection}>
        <div className={styles.wlHeader}>
          <div className={styles.wlTitleGroup}>
            <h1 className={styles.wlTitle}>Watchlist</h1>
            <span className={styles.wlCount}>titles</span>
          </div>
          <div className={styles.wlControls}>
            <div className={styles.wlSearchWrap}>
              <span className={`material-symbols-rounded ${styles.wlSearchIcon}`}>search</span>
              <input type="text" className={styles.wlSearchInput} placeholder="Search your list..." autoComplete="off" value={`${search}`} onChange={(e) => {setSearch(e.target.value)}} />
            </div>
            <div className={styles.wlSortWrap}>
              <select className={styles.wlSortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date added</option>
                <option value="title">Title A–Z</option>
                <option value="score">Score</option>
              </select>
              <span className={`material-symbols-rounded ${styles.wlSortChevron}`}>expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className={styles.wlGrid}>
        {watchlistArr.length > 0 && sortedList.map(item => (
          <AnimeCard
            id={item.id}
            key={item.id}
            img={item.coverImage.extraLarge || "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AIRpIM.jpg"}
            alt={item.title.romaji}
            title={item.title.romaji}
            score={item.averageScore / 10}
            sub={`${item.format} · ${item.episodes ? item.episodes : '?'} ep`}
            airing={item.status}
          />
        ))}

        {watchlistArr.length === 0 && (
          <div className={styles.emptyStateSpan}>
            <EmptyState
              icon="bookmark_border"
              title="Your watchlist is empty"
              subtitle="Anime you save will show up here. Start adding titles from the browse page."
            />
          </div>
        )}

        {watchlistArr.length > 0 && (
          <nav className={styles.browsePagination} aria-label="Watchlist pages">
            <button className={`${styles.pgBtn} ${styles.pgArrow}`} 
              disabled = {page <= 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
            <div className={styles.pgPages}>
              <button className={`${styles.pgBtn} ${styles.pgNumActive}`}>{page}</button>
            </div>
            <button className={`${styles.pgBtn} ${styles.pgArrow}`} 
              disabled={page >= totalPages}
              onClick={() => {
                setPage(prev => prev + 1)
              }}
            >
              <span className="material-symbols-rounded">chevron_right</span>
            </button>
          </nav>
        )}

      </div>

    </div>
  );
}

export default Watchlist;
