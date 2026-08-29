import './global.css';
import Homepage from './components/homepage/homepage.jsx';
import Header from './components/shared/header.jsx'
import Footer from './components/shared/footer.jsx';
import Filterpage from './components/filterpage/filterpage.jsx';
import InfoPage from './components/infopage/infopage.jsx';
import Watchlist from './components/watchlist/watchlist.jsx';
import Error404 from './components/shared/error404.jsx';
import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  const URL = 'https://graphql.anilist.co'
  const [heroSectionData, setHeroSectionData] = useState(null)
  const [trendingSectionData, setTrendingSectionData] = useState(null)
  const [thisSeasonData, setThisSeasonData] = useState(null)
  const [popularSectionData, setPopularSectionData] = useState(null)
  const [searchPageAnimeData, setSearchPageAnimePage] = useState(null)

  const query = `
    query($season: MediaSeason, $seasonYear: Int, $perPage: Int){
      HeroSectionData: Page(page: 1, perPage: $perPage){
        media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: SCORE_DESC){
          format
          averageScore
          genres
          title{
            romaji
          }
          description
          episodes
          status
          seasonYear
          bannerImage
          studios(isMain: true){
            nodes{
              name
            }
          }
          id
        }
      }

      TrendingSectionData: Page(page: 1, perPage: 10){
        media(type: ANIME, sort: TRENDING_DESC){
          id
          title{
            romaji
          }
          coverImage{
            extraLarge
          }
          averageScore
          episodes 
          format
          status
        }
      }

      ThisSeasonData: Page(page: 1, perPage: 10){
        media(sort: SCORE_DESC, type: ANIME, season: $season, seasonYear: $seasonYear){
          id
          title{
            romaji
          }
          episodes
          format
          averageScore
          coverImage{
            extraLarge
          }
          season
          seasonYear
          status
        }
      }

      PopularSectionData: Page(page: 1, perPage: 10){
        media(type: ANIME, sort: POPULARITY_DESC){
          id
          title{
            romaji
          }
          coverImage{
            extraLarge
          }
          averageScore
          episodes 
          format
          status
        }
      }
    }
  `
  //search, season, seasonYear, sort, status, genre
  async function getData(season, seasonYear, perPage){
    const variables = {season, seasonYear, perPage}
    
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
    getData('SUMMER', 2026, 5).then(data => {
        setHeroSectionData(data.HeroSectionData)
        setTrendingSectionData(data.TrendingSectionData)
        setThisSeasonData(data.ThisSeasonData)
        setPopularSectionData(data.PopularSectionData)
        return
    })
  },[])


  return (
    <>
      <BrowserRouter>
        <Header/>
        <main>
          <Routes>
            <Route path='/' 
              element={<Homepage 
                heroSectionData={heroSectionData}
                trendingSectionData={trendingSectionData}
                thisSeasonData={thisSeasonData}
                popularSectionData={popularSectionData}
              />}
            />
            <Route path='/search' element={<Filterpage/>} />
            <Route path='/info/:id' element={<InfoPage/>} />
            <Route path='/watchlist' element={<Watchlist/>} />
            <Route path='*' element={<Error404/>} />
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
