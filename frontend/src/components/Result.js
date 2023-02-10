import React from 'react'
import '../css/result.css'

export const Result = () => {
    return (
        <div className='result_body'>
            <div className="parent">
                <div className="child">
                    <h3 className="h3"id="cd1">20</h3>
                    <h4>Donald Trump</h4>
                    <p>Republic Party</p>
                </div>

                <div className="child">
                    <h3 className="h3" id="cd2"> 40 </h3>
                    <h4>Joe Biden</h4>
                    <p>Democratic Party</p>
                </div>
                {/*------------------ candidate 3 votes detail ------------------------------------*/}
                <div className="child">
                    <h3 className="h3" id="cd3"> 30  </h3>
                    <h4>Barak Obama</h4>
                    <p>Faderation Party</p>
                </div>
            </div>
        </div>


    )
}
