import styles from './homepage.module.css';
import AnimeRow from '../shared/animeRow.jsx';
import AnimeCard from '../shared/animeCard.jsx';
import LoadingSpinner from '../shared/loadingSpinner.jsx';
import {useEffect, useState } from 'react';
import {useSwipeable} from 'react-swipeable'
import { Link } from 'react-router-dom';
import { useWatchlist } from '../../context/watchlistContext';



function Homepage({heroSectionData, trendingSectionData, thisSeasonData, popularSectionData}) {
    const [slide, setSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const {watchlistArr, toggleWatchlistArr} = useWatchlist()
    let cleanDescription = ''

    useEffect(() => {
      if(!heroSectionData) return;
      if(isPaused) return;
      const interval = setInterval(() => {
        setSlide((value) => ((value + 1) % heroSectionData.media.length))
      }, 6000)

      return () => {clearInterval(interval)}
    },[heroSectionData, slide, isPaused])

    function nextSlide(){
      setSlide(value => ((value + 1) % heroSectionData.media.length))
    }

    function prevSlide(){
      setSlide(value => (value - 1 + heroSectionData.media.length) % heroSectionData.media.length) 
    }

    const handlers = useSwipeable({
      onSwipedLeft: () => nextSlide(), onSwipedRight: () => prevSlide(), trackMouse: true
    })

    if (!heroSectionData) return <LoadingSpinner fullPage/>;

  return (
    <>
      <div>
        {/* HERO */}
        <section
          className={styles.hero}
          {...handlers}
          onMouseDown={(e) => { handlers.onMouseDown?.(e); setIsPaused(true) }}
          onMouseUp={(e) => { handlers.onMouseUp?.(e); setIsPaused(false) }}
          onMouseLeave={(e) => { handlers.onMouseLeave?.(e); setIsPaused(false) }}
          onTouchStart={(e) => { handlers.onTouchStart?.(e); setIsPaused(true) }}
          onTouchEnd={(e) => { handlers.onTouchEnd?.(e); setIsPaused(false) }}
        >
          {heroSectionData.media.map((item, index) => (
            <div 
              key={item.id} 
              className={`${styles.heroSlide} ${index === slide ? styles.heroSlideActive : ''}`}
            >
              {cleanDescription = item.description.replace(/<[^>]+>/g, '')}
            {/* bg-img */}
              <div className={styles.heroBg}>
                <img
                  src={item.bannerImage || "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-RtgLkOgSDgYb.jpg"}
                  alt={item.title ? item.title : '?'}
                  className={styles.heroImg}
                />
                <div className={styles.heroGradient}></div>
              </div>
            
              <div className={styles.heroLayout}>
                <div className={styles.heroContent}>
                  <div className={styles.heroTags}>
                    {item.format && <span className={styles.tag}>{item.format}</span>}
                    {item.averageScore && <span className={`${styles.tag} ${styles.tagScore}`}>
                      <span className="material-symbols-rounded rating-icon" aria-hidden="true">star</span>{item.averageScore/10}
                    </span>}
                    {item.genres?.[0] && <span className={`${styles.tag} ${styles.tagGenre}`}>{item.genres[0]}</span>}
                    {item.genres?.[1] && <span className={`${styles.tag} ${styles.tagGenre}`}>{item.genres[1]}</span>}
                  </div>
                  {item.title.romaji && <h1 className={styles.heroTitle}>
                    {item.title.romaji}
                  </h1>}
                  {item.description && <p className={styles.heroSynopsis}>
                    {cleanDescription}
                  </p>}
                  <div className={styles.heroStats}>
                    {item.episodes && <>
                      <div className={styles.stat}><span className={styles.statLabel}>Episodes</span><span className={styles.statVal}>{item.episodes}</span></div>
                      <div className={styles.statDivider}></div>
                    </>}
                    {item.status && <>
                      <div className={styles.stat}><span className={styles.statLabel}>Status</span><span className={styles.statVal}>{item.status}</span></div>
                      <div className={styles.statDivider}></div>
                    </>}
                    {item.seasonYear && <>
                      <div className={styles.stat}><span className={styles.statLabel}>Year</span><span className={styles.statVal}>{item.seasonYear}</span></div>
                      <div className={styles.statDivider}></div>
                    </>}
                    {item.studios.nodes[0]?.name && <div className={styles.stat}><span className={styles.statLabel}>Studio</span><span className={styles.statVal}>{item.studios.nodes[0]?.name}</span></div>}
                    
                  </div>
                  <div className={styles.heroActions}>
                    <button className="btn-primary">
                      <span className="material-symbols-rounded button-icon" aria-hidden="true">play_arrow</span>
                      Watch Trailer
                    </button>
                    <button className="btn-ghost" onClick={() => toggleWatchlistArr(item.id)}>
                      <span className="material-symbols-rounded button-icon" aria-hidden="true">bookmark</span>
                      {`${watchlistArr.includes(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist' }`}
                    </button>
                    <Link className="btn-watch" to={`/info/${heroSectionData.media[index].id}`}>Anime info <span className="material-symbols-rounded text-icon" aria-hidden="true">arrow_forward</span></Link>
                  </div>
                </div>
              </div>

              <div className={styles.heroIndicators}>
                {heroSectionData.media.map((_, i) => (
                  <span 
                    key={i} 
                    className={`${styles.indicator} ${i === slide ? styles.indicatorActive : ''}`}
                    onClick={() => {setSlide(i)}}
                    ></span>
                ))}
              </div>

            </div>
          ))}
        </section>

        {/* MAIN ROWS */}
        <main className={styles.main}>

          {/* TRENDING */}
          <AnimeRow title="Trending Now">
            {trendingSectionData.media.map((item) => (
              <AnimeCard
                id={item.id}
                key={item.id}
                img={item.coverImage.extraLarge}
                title={item.title.romaji}
                sub={`${item.format} · ${item.episodes ? item.episodes : '?'} ep`}
                score={item.averageScore/10}
                airing={item.status}
              />
            ))}
          </AnimeRow>

          {/* THIS SEASON */}
          <AnimeRow title="This Season" seasonBadge={`${thisSeasonData.media[0].season} ${thisSeasonData.media[0].seasonYear}`}>
            {thisSeasonData.media.map((item) => (
              <AnimeCard
                id={item.id}
                key={item.id}
                img={item.coverImage.extraLarge}
                title={item.title.romaji}
                sub={`${item.format} · ${item.episodes ? item.episodes : '?'} ep`}
                score={item.averageScore/10}
                airing={item.status}
              />
            ))}
            
          </AnimeRow>

          {/* ALL TIME POPULAR */}
          <AnimeRow title="All Time Popular">
            {popularSectionData.media.map((item) => (
              <AnimeCard
                id={item.id}
                key={item.id}
                img={item.coverImage.extraLarge}
                title={item.title.romaji}
                sub={`${item.format} · ${item.episodes ? item.episodes : '?'} ep`}
                score={item.averageScore/10}
                airing={item.status}
              />
            ))}
          </AnimeRow>
        </main>
      </div>
    </>
  );
}

export default Homepage;
