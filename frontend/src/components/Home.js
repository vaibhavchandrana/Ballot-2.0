import React from 'react'
import '../css/home.css'
import img from '../images/voting_image'

export const Home = () => {
  return (
    <div className='home_container'>
        <div className='content_container'></div>
        <div className='image-div'>
            <img src={img} alt="voting img" />
        </div>
    </div>
  )
}

