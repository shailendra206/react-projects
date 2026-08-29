import styles from './filterpage.module.css';
import AnimeCard from '../shared/animeCard.jsx';
import LoadingSpinner from '../shared/loadingSpinner.jsx';
import EmptyState from '../shared/emptyState.jsx';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

function Filterpage() {
  const genreRef = useRef(null);

  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search')  || '';
  const [animeData, setAnimeData] = useState(null)
  const [page, setPage] = useState(1) //on which page
  const [pageInfo, setPageInfo] = useState(null) //API data, total, currentPage, lastPage, hasNextPage
  const URL = 'https://graphql.anilist.co'
  const query = `
    query($search: String, $season: MediaSeason, $seasonYear: Int, $genre: [String], $sort: [MediaSort], $status: MediaStatus, $page: Int){
      Page(page: $page, perPage: 14){
        pageInfo{
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(type: ANIME, search: $search, season: $season, seasonYear: $seasonYear, genre_in: $genre, sort: $sort, status: $status){
          title{
            romaji
            english
            native
          }
          id
          status
          averageScore
          coverImage{
            extraLarge
          }
          format
          episodes
        }
      }
    }
  ` 
  async function getAnime(variables){
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
  
  const [filter, setFilter] = useState({
    search: searchFromUrl, season: '', seasonYear: '', genre : [], status: '', sort: 'TRENDING_DESC'
  })

  function handleFilterChanges(e){
    const {name, value} = e.target; 
    setFilter(prev => ({...prev, [name] : value}))
  }
    
  function buildVar(filter, page){ // function to not send empty string, cause then anilist will treat that value as input.
    const vars = {page} //vars = {page.page} -> vars.page = 3
    if(filter.search) vars.search = filter.search
    if(filter.season) vars.season = filter.season
    if(filter.seasonYear) vars.seasonYear = Number(filter.seasonYear)
    if(filter.genre.length) vars.genre = filter.genre
    vars.sort = [filter.sort]
    if(filter.status) vars.status = filter.status
    return vars
  }

  function handleGenre(genre_input){ //value = "Action"
    setFilter(item => {
      const isGenreExist = item.genre.includes(genre_input) //true or false
    return{...item, genre: isGenreExist ? item.genre.filter(i => i !== genre_input) : [...item.genre, genre_input]} // genre is new key, which overrides the prev's genre key, [...prev.genre] is inside the barckets cuz it's an array.
    })
  }

  function runSearch(){
    setPage(1)
    getAnime(buildVar(filter, 1)).then(data => {
      setAnimeData(data.media)
      setPageInfo(data.pageInfo)
    })
  }

  useEffect(() => {
    setFilter(prev => ({...prev, search: searchFromUrl}) )
    setPage(1)
    getAnime(buildVar({...filter, search: searchFromUrl}, 1)).then(data => {
      setAnimeData(data.media)
      setPageInfo(data.pageInfo)
    })
  }, [searchFromUrl])

  useEffect(() => {
    function handleEnter(e){
      if(e.key === 'Enter'){
        e.preventDefault()
        runSearch()
      }
    }
    document.addEventListener('keydown', handleEnter)
    return () => document.removeEventListener('keydown', handleEnter)
  }, [filter])

  useEffect(() => {
    getAnime(buildVar(filter, page)).then(data => {
      setAnimeData(data.media)
      setPageInfo(data.pageInfo)
    })
  }, [page])

  function closeGenreDropdown(){
    if(genreRef.current) genreRef.current.removeAttribute('open')
  }
  
  if(!animeData || !pageInfo) return <LoadingSpinner fullPage/>;

  return (
    <div className={styles.browsePage}>

      {/* FILTER SECTION */}
      <div className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitleGroup}>
            <h1 className={styles.browseTitle}>Browse</h1>
            <span className={styles.resultsCount}>anime</span>
          </div>
          <button className={styles.filterReset} type="button" onClick={() => {
              setFilter({search: '', season: '', seasonYear: '', genre: [], status: '', sort: 'TRENDING_DESC'})
              getAnime(buildVar({search: '', season: '', seasonYear: '', genre: [], status: '', sort: 'TRENDING_DESC'}, 1)).then(data => {
                setPage(1)
                setAnimeData(data.media)
                setPageInfo(data.pageInfo)
              })
            }}>
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>filter_alt_off</span>
            Clear filters
          </button>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.filterInputWrap}>
            <span className={`material-symbols-rounded ${styles.filterInputIcon}`}>search</span>
            <input type="text" className={styles.filterInput} placeholder="Search title..." autoComplete="off" name="search" value={filter.search} onChange={handleFilterChanges} />
          </div>

          <details className={styles.genreDropdown} ref={genreRef}>
            <summary className={styles.genreDropdownToggle}>
              Genre
              <span className={`material-symbols-rounded ${styles.genreChevron}`}>expand_more</span>
            </summary>
            <div className={styles.genreDropdownPanel}>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Action') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Action')}>Action</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Adventure') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Adventure')}>Adventure</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Comedy') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Comedy')}>Comedy</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Drama') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Drama')}>Drama</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Fantasy') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Fantasy')}>Fantasy</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Horror') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Horror')}>Horror</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Mystery') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Mystery')}>Mystery</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Psychological') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Psychological')}>Psychological</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Romance') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Romance')}>Romance</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Sci-Fi') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Sci-Fi')}>Sci-Fi</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Slice of Life') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Slice of Life')}>Slice of Life</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Sports') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Sports')}>Sports</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Supernatural') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Supernatural')}>Supernatural</button>
              <button type="button" className={`${styles.genreChip} ${filter.genre.includes('Thriller') ? styles.genreChipActive : ''}`} onClick={() => handleGenre('Thriller')}>Thriller</button>
              <button type="button" className={styles.genreDropdownClose} onClick={closeGenreDropdown}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
          </details>

          <div className={styles.filterSelectWrap}>
            <select className={styles.filterSelect} name="status" value={filter.status} onChange={handleFilterChanges}>
              <option value="">Status</option>
              <option value="RELEASING">Airing</option>
              <option value="FINISHED">Finished</option>
              <option value="NOT_YET_RELEASED">Upcoming</option>
            </select>
            <span className={`material-symbols-rounded ${styles.filterChevron}`}>expand_more</span>
          </div>

          <div className={styles.filterSelectWrap}>
            <select className={styles.filterSelect} name="season" value={filter.season} onChange={handleFilterChanges}>
              <option value="">Season</option>
              <option value="WINTER">Winter</option>
              <option value="SPRING">Spring</option>
              <option value="SUMMER">Summer</option>
              <option value="FALL">Fall</option>
            </select>
            <span className={`material-symbols-rounded ${styles.filterChevron}`}>expand_more</span>
          </div>

          <div className={styles.filterSelectWrap}>
            <select className={styles.filterSelect} name="seasonYear" value={filter.seasonYear} onChange={handleFilterChanges}>
              <option value="">Year</option>
              {Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => new Date().getFullYear() - i)
                .map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <span className={`material-symbols-rounded ${styles.filterChevron}`}>expand_more</span>
          </div>

          <div className={styles.filterSelectWrap}>
            <select className={styles.filterSelect} name="sort" value={filter.sort} onChange={handleFilterChanges}>
              <option value="TRENDING_DESC">Trending</option>
              <option value="POPULARITY_DESC">Popular</option>
              <option value="SCORE_DESC">Top Rated</option>
              <option value="TITLE_ROMAJI">A–Z</option>
              <option value="START_DATE_DESC">Newest</option>
            </select>
            <span className={`material-symbols-rounded ${styles.filterChevron}`}>expand_more</span>
          </div>

          <button className={styles.filterSearchBtn} type="button" onClick={runSearch}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>search</span>
            Search
          </button>
        </div>

        <div className={styles.activeFilters}>
          {filter.genre.map(item => (
            <span className={styles.filterChip} key={item} value={item}>
              {item}
              <span className="material-symbols-rounded" style={{ fontSize: '14px' }} onClick={() => {handleGenre(item)}}>close</span>
            </span>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className={styles.browseGrid}>

        { animeData && animeData.map(item => (
          <AnimeCard
            id={item.id}
            key={item.id}
            img={item.coverImage.extraLarge}
            title={item.title.romaji}
            sub={`${item.format} · ${item.episodes ? item.episodes : '?'} ep`}
            score={item.averageScore/10}
            airing={item.status}
          />
        )) }

        {animeData && animeData.length === 0 && (
          <div className={styles.emptyStateSpan}>
            <EmptyState
              icon="search_off"
              title="No results found"
              subtitle="Try adjusting your filters or search term."
            />
          </div>
        )}

        {/* PAGINATION */}
        <nav className={styles.browsePagination} aria-label="Browse pages">
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
            disabled={!pageInfo?.hasNextPage}
            onClick={() => {
              setPage(prev => prev + 1)
            }}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </nav>

        {/* <div className={styles.browseEmpty} hidden>
          <span className={`material-symbols-rounded ${styles.browseEmptyIcon}`}>search_off</span>
          <p className={styles.browseEmptyTitle}>No results found</p>
          <p className={styles.browseEmptySub}>Try adjusting your filters or search term</p>
          <button className={`btn-ghost ${styles.browseEmptyBtn}`} type="button">Clear all filters</button>
        </div> */}
      </div>

    </div>
  );
}

export default Filterpage;
