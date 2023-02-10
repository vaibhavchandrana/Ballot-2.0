import React from 'react'
import '../css/signin.css'

export const Login = () => {
    var preloader = document.getElementById("loader");
         function myFunction(){
            preloader.style.display = "none";
         }
    return (
            <div onload={setTimeout(myFunction, 3000)} className="body" >
                <div id="loader">
                    <img src="../images/giphy.gif" alt="loder " id="image" />
                </div>
                <div className="container" >
                    <div className="title">Login</div>
                    <br />
                    <div className="content">
                        {/* <!-------------------- form  start here--------------------------------------> */}

                        <div className="form"method="post">
                            <div className="user-details">
                                {/* <h2 style={{color:"red"}}>error1</h2> */}
                                <div className="input-box">
                                    <span className="details">Username</span>
                                    <input type="Email" placeholder="Enter your Username(Email)" name="email" required />
                                </div><br/><br/><br/>
                                    <div className="input-box">
                                        <span className="details">Password</span>
                                        <input type="password" placeholder="Enter your password" name="pass" required />
                                    </div>
                                </div>
                                    <div className="button">
                                        <input type="submit" name="signin" value="Login" />
                                    </div>
                                </div>
                                    {/* <!---------------------------- form ends here--------------------------------------------> */}

                                    <div className="signup1">
                                        <i style={{color:"white"}}> Visting for first time?</i>
                                        <a href='/'><button className="btn">Sign up</button></a>
                                    </div>
                            </div>
                    </div>
                </div>

        
            )
}