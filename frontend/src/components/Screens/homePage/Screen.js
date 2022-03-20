import React from 'react'

import { useState, useEffect } from 'react'
import { Navigation } from './navigation'
import { Header } from './header'
import { Features } from './features'
import { About } from './about'
import { Services } from './services'
import { Gallery } from './gallery'
import JsonData from './data.json'
import SmoothScroll from 'smooth-scroll'

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const HomePage = (props) => {
  const [landingPageData, setLandingPageData] = useState({})
  useEffect(() => {
    setLandingPageData(JsonData)
  }, [])

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Services data={landingPageData.Services} />
      <Gallery />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
    </div>
  )
}

export default HomePage;
