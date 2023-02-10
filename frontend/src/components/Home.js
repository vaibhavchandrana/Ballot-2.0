import React from 'react'
import '../css/home.css'
import {Link } from 'react-router-dom'
export const Home = () => {
    return (
        <div className='home_body'>
            <div className='home_container'>

                <div className='image-div'>
                    <img src={"https://www.gifimages.pics/images/quotes/english/general/gif-for-voting-52650-149181.gif"} alt="voting img" />
                </div>
                <div className='content_container'>
                    <span>Take Charge of
                        Your Vote</span>
                    <p>Upgrade from manually counting ballots to an online election system without sacrificing the integrity of your vote</p>
                    <Link to ="/login"><button className ="start_btn">Get Started</button></Link>
                </div>
            </div>
            <div className='feature_div'>
                <div className='feature_heading'>
                    <span>An online voting system which Comes with </span>
                </div>
                <div className='two_features'>
                    <div className='feature_list'>
                        <span id="icons" style={{fontSize:'6rem'}} class="material-icons">
                            lock
                        </span>
                        <h1>
                            A reliable online voting tool.
                        </h1>
                        <h3>Run online elections for an important event or manage consistent, recurring votes.</h3>
                    </div>
                    <div className='feature_list'>
                        <span id="icons" style={{fontSize:'6rem'}} class="material-icons">
                            check_circle
                        </span>
                        <h1>
                            Key electronic voting features.
                        </h1>
                        <h3>Stay protected against double voting and other forms of vote manipulation. Get results instantly and dive deeper into voter analytics.</h3>
                    </div>
                </div>
                <div className='two_features'>
                    <div className='feature_list'>
                        <span id="icons" style={{fontSize:'6rem'}} class="material-icons">
                            devices
                        </span>
                        <h1>
                            Web app-based voting platform.
                        </h1>
                        <h3>Send eligible voters to a personalized voting website, without having to download an online voting app.</h3>
                    </div>
                    <div className='feature_list'>
                        <span id="icons" style={{fontSize:'6rem'}} class="material-icons">
                            sentiment_very_satisfied
                        </span>
                        <h1>
                            A pleasant way to cast votes.
                        </h1>
                        <h3>Your voters deserve a fair and easy to use voting website, accessible from any device.</h3>
                    </div>
                </div>
                <div className='two_features'>
                    <div className='feature_list'>
                        <span id="icons" style={{fontSize:'6rem'}} class="material-icons">
                            photo_camera
                        </span>
                        <h1>
                            Monitoring Using Face recognition.
                        </h1>
                        <h3>User face is monitored at time of registeration and voting to ensure that one user can not voted twice.</h3>
                        <p className='danger'>This facility is not available right now because of some error at hosting.You will get this feature from my git hub</p>
                        <button className='github_btn'>Check It</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

