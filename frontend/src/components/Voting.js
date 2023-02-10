import React, { useState } from 'react'
import '../css/voting.css'
import profile from "../images/profile.png"


export const Voting = () => {
    const [voterId,setVoterId]=useState(0)
    const updateVoterId = (id)=>{
        setVoterId(id);
        console.log(voterId);
    }
    return (
        <div className='voting_body'>
            <div className="card">
                <div className="card-body">
                    <div className="profile">
                        <img src={profile} alt="profile " />
                    </div>
                    <div className="detail">
                        <p id="big">Barak Obama</p>
                        <p id="small">Republican party</p>
                    </div>
                    <div className="voting-button">
                        <button onClick={() => updateVoterId(1)} id="{{candidate.id}}">Vote</button>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="profile">
                        <img src={profile} alt="profile" />
                    </div>
                    <div className="detail">
                        <p id="big">Donald Trump</p>
                        <p id="small">Democrating party</p>
                    </div>
                    <div className="voting-button">
                        <button onClick={() => updateVoterId(2)} id="{{candidate.id}}">Vote</button>
                    </div>
                </div>
            </div>
            <center><button type="submit"  id="subbtn">Confirm</button></center>
            </div>
            )
}
