import React from 'react'
import '../css/home.css'
// import img from '../images/voting_image2.jpg'

export const Home = () => {
    return (
        <div className='body'>
            <div className='home_container'>
                <div className='content_container'>
                    <span>Take Charge of
                        <br/>
                        Your Vote</span>
                </div>
                <div className='image-div'>
                    <img src={"https://www.gifimages.pics/images/quotes/english/general/gif-for-voting-52650-149181.gif"} alt="voting img" />
                </div>
            </div>
        </div>
    )
}

