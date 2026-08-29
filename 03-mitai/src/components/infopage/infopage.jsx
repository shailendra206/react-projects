import styles from './infopage.module.css';
import PersonCard from '../shared/personCard.jsx';
import RelatedTitleCard from '../shared/relatedTitleCard.jsx';
import LoadingSpinner from '../shared/loadingSpinner.jsx';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef} from 'react';
import { useWatchlist } from '../../context/watchlistContext.jsx';

function InfoPage() {
  let {id} = useParams()
  id = Number(id)
  
  const [animeData, setAnimeData] = useState(null)
  const [displayDescription, setDisplayDescription] = useState(false)
  const [isClamped, setIsClamped] = useState(null)
  const URL = 'https://graphql.anilist.co'
  const textRef = useRef(null)
  const {watchlistArr, toggleWatchlistArr} = useWatchlist()

  let cleanDescription = ''

  const query = `
    query($id: Int){
      Media(id: $id, type: ANIME){
        id
        genres
        title{
          romaji
        }
        coverImage{
          extraLarge
        }
        bannerImage
        averageScore
        format
        status
        episodes
        duration
        season
        seasonYear
        description
        trailer{
          id
          site
          thumbnail
        }

        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        studios(isMain: true){
            nodes{
              name
            }
        }
        source
        popularity
        favourites
        characters(page: 1, perPage: 10, sort: ROLE){
          nodes{
            image{
              large
            }
            name{
              full
            }
          }
        }
        
        staff(sort: RELEVANCE){
          nodes{
            name{
              full
            }
            image{
              large
            }
          }
        }
        
        relations{
          edges{
            relationType
            node{
              id
              title{
                romaji
              }
              coverImage{
                large
              }
              
            }
          }
        }

        tags{
          id
          name
          rank
        }
      }
    }
  `

  async function getAnimeInfo(id){
    const variables = {id}
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
    return data.data
  }

  useEffect(() => {
    getAnimeInfo(id).then(data => {
      setAnimeData(data.Media)
    })
  }, [id])

  useEffect(() => {
    if(!animeData) return
    const el = textRef.current
    if(el){
      setIsClamped(el.scrollHeight > el.clientHeight) //scrollHeight - full/visible content height & clientHeight - visible content height
    }
  }, [animeData]) // y animeData works but not animeData.description

  if(!animeData) return <LoadingSpinner fullPage/>;
  
  cleanDescription = animeData.description.replace(/<[^>]+>/g, '')
  const animeTagsData = animeData.tags.slice(0,10)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const trailerUrl = animeData.trailer ? (animeData.trailer.site === "youtube" ? `https://www.youtube.com/embed/${animeData.trailer.id}` : `https://www.dailymotion.com/embed/video/${animeData.trailer.id}`) : null;
  const sortedStaff = [...new Map(
    animeData.staff.nodes.map(item => [item.name.full, item])
  ).values()]

  return (
    <>
      {/* HERO */}
      <div className={styles.detailHero}>
        <div className={styles.detailBannerWrap}>
          <img
            className={styles.detailBannerImg}
            src={animeData.bannerImage || "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-RtgLkOgSDgYb.jpg"}
            alt=""
          />
          <div className={styles.detailBannerGradient}></div>
        </div>

        <div className={styles.detailHeroBody}>
          <img
            className={styles.detailPoster}
            src={animeData.coverImage.extraLarge || "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AIRpIM.jpg"}
            alt=""
          />

          <div className={styles.detailHeroText}>
            <div className={styles.detailGenres}>
              {animeData.genres.slice(0,5).map((item) => (
                <span className={styles.detailGenreTag}>{item}</span>
              ))}
            </div>

            <h1 className={styles.detailTitle}>{animeData.title.romaji || animeData.title.english || animeData.title.native} </h1>

            <div className={styles.detailMetaRow}>
              {animeData.averageScore && <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Score</span>
                <span className={`${styles.detailMetaValue} ${styles.detailMetaScore}`}>
                  <span className="material-symbols-rounded rating-icon">star</span> {animeData.averageScore / 10} / 10
                </span>
              </div>}
              {animeData.format && <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Format</span>
                <span className={styles.detailMetaValue}>{animeData.format}</span>
              </div>}
              {animeData.episodes && <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Episodes</span>
                <span className={styles.detailMetaValue}>{animeData.episodes}</span>
              </div>}
              {animeData.status && <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Status</span>
                <span className={styles.detailMetaValue}>{animeData.status}</span>
              </div>}
              
              {animeData.seasonYear && <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Season</span>
                <span className={styles.detailMetaValue}>{`${animeData.season} ${animeData.seasonYear}`}</span>
              </div>}
            </div>

            <div className={styles.detailActions}>
              <button className="btn-primary">
                <span className="material-symbols-rounded button-icon">play_arrow</span>
                Watch Trailer
              </button>
              <button className="btn-ghost" onClick={() => toggleWatchlistArr(id)}>
                <span className="material-symbols-rounded button-icon">bookmark</span>
                {`${watchlistArr.includes(id) ? 'Remove from Watchlist' : 'Add to Watchlist' }`}
              </button>
              {/* <button className="btn-watch">
                Watch Anime <span className="material-symbols-rounded text-icon">arrow_forward</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className={styles.detailBody}>

        <div className={styles.detailMain}>

          {/* SYNOPSIS */}
          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Synopsis</h2>
            <p className={`${styles.detailSynopsis} ${displayDescription ? styles.expanded : ''}`} ref={textRef}>
              {cleanDescription}
            </p>
            {isClamped && <button className={styles.synopsisToggle}
              onClick={() => setDisplayDescription(prev => !prev)}
            >{displayDescription ? 'Read less' : 'Read More'}</button>}
          </section>

          {/* TRAILER */}
          {trailerUrl && <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Trailer</h2>
            <div className={styles.detailTrailerWrap}>
              <iframe
                loading="lazy"
                width="100%"
                height="480"
                src={trailerUrl}
                title="Anime Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>}

          {/* CHARACTERS */}
          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Characters</h2>
            <div className={styles.personRow}>
              {animeData.characters.nodes?.map((item, index) => (
                <PersonCard key={index} img={item.image?.large || "https://s4.anilist.co/file/anilistcdn/character/large/b11-qHJigyTnBiDX.png"} alt={item.name.full} name={item.name.full}/>
              ))}
              
            </div>
          </section>

          {/* STAFF */}
          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Staff</h2>
            <div className={styles.personRow}>
              {sortedStaff.map((item, index) => (
                <PersonCard key={index} img={item.image.large || "https://s4.anilist.co/file/anilistcdn/staff/large/n95623-pntRaLMVPAVE.png"} alt={item.name.full} name={item.name.full}/>
              ))}
            </div>
          </section>

          {/* RELATED TITLES */}
          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Related Titles</h2>
            <div className={styles.relationsRow}>
              {animeData.relations.edges.map((item, index) => (
                <RelatedTitleCard key={index} img={item.node?.coverImage.large || "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx121-u1M1MFBbCXzo.jpg"} alt={item.node.title.romaji} type={item.relationType} title={item.node.title.romaji} />
              ))}
            </div>
          </section>

        </div>

        {/* SIDEBAR */}
        <aside className={styles.detailSidebar}>

          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Information</h2>
            <dl className={styles.infoList}>
              {animeData.format && 
                <>
                  <dt className={styles.infoLabel}>Format</dt>    
                  <dd className={styles.infoValue}>{animeData.format}</dd>
                </>
              }
              {animeData.episodes && 
                <>
                  <dt className={styles.infoLabel}>Episodes</dt>  
                  <dd className={styles.infoValue}>{animeData.episodes}</dd>
                </>
              }
              {animeData.duration && 
                <>
                  <dt className={styles.infoLabel}>Duration</dt>  
                  <dd className={styles.infoValue}>{animeData.duration}</dd>
                </>
              }
              {animeData.status && 
                <>
                  <dt className={styles.infoLabel}>Status</dt>    
                  <dd className={styles.infoValue}>{animeData.status}</dd>
                </>
              }
              {animeData.startDate?.day &&
                <>
                  <dt className={styles.infoLabel}>Start date</dt>
                  <dd className={styles.infoValue}> {animeData.startDate.day} {months[animeData.startDate.month - 1]} {animeData.startDate.year}</dd>
                </>
              }
              {animeData.endDate?.day && 
                <>
                  <dt className={styles.infoLabel}>End date</dt>
                  <dd className={styles.infoValue}>{animeData.endDate.day} {months[animeData.endDate.month - 1]} {animeData.endDate.year}</dd>
                </>
              }
              {animeData.studios.nodes[0]?.name && 
                <>
                  <dt className={styles.infoLabel}>Studio</dt>
                  <dd className={styles.infoValue}>{animeData.studios.nodes[0].name}</dd>
                </>
              }
              {animeData.source && 
                <>
                  <dt className={styles.infoLabel}>source</dt>
                  <dd className={styles.infoValue}>{animeData.source}</dd>
                </>
              }
              {animeData.popularity && 
                <>
                  <dt className={styles.infoLabel}>Popularity</dt>
                  <dd className={styles.infoValue}>{animeData.popularity}</dd>
                </>
              }
              {animeData.favourites && 
                <>
                  <dt className={styles.infoLabel}>Favourites</dt>
                  <dd className={styles.infoValue}>{animeData.favourites}</dd>
                </>
              }
            </dl>
          </section>

          <section className={styles.detailSection}>
            <h2 className={styles.detailSectionTitle}>Tags</h2>

            
            <div className={styles.tagsList}>
              {animeTagsData.map(item => (
                <div className={styles.tagItem} key={item.id}>
                  <span className={styles.tagName}>{item.name}</span>
                  <div className={styles.tagBarWrap}><div className={styles.tagBarFill} style={{ width: `${item.rank}%` }}></div></div>
                  <span className={styles.tagPct}>{item.rank}%</span>
                </div>
              ))}
            </div>
          </section>

        </aside>

      </div>
    </>
  );
}

export default InfoPage;
