import React from 'react'
import { Link } from 'react-router-dom'
import '../css/signin.css'


export const Registration = () => {
  return (
    <div className='body'>
    <div className="container extra">
    <div className="title">Registration</div>
    <div className="content">
      {/*------------------registration form start here------------------------------------*/}
      <div className='form' method="post" onsubmit=" return validate()" encType="multipart/form-data">
        <div className="user-details">
          <div className="input-box">
            <span className="details">Full Name</span>
            <input type="text" placeholder="Enter your name" id="name" name="name" required />
            <br /><span id="error1" className="error" />
          </div>
          <div className="input-box">
            <span className="details">Email</span>
            <input type="Email" placeholder="Enter your Email" id="email" name="email" required />
          </div>
          <div className="input-box">
            <span className="details">Age</span>
            <input type="text" placeholder="enter your age" name="age" id="age" required />
            <br /><span id="errorAge" className="error" />
          </div>
          <div className="input-box">
            <span className="details">Phone Number</span>
            <input type="text" placeholder="Enter your number" id="phone" name="phone" required />
            <br /><span id="error2" className="error" />
          </div>
          <div className="input-box">
            <span className="details">Password</span>
            <input type="password" placeholder="Enter your password" id="pass" name="pass" required />
            <br /><span id="error3" className="error" />
          </div>
          <div className="input-box">
            <span className="details">Confirm Password</span>
            <input type="password" placeholder="Confirm your password" id="cpass" name="c_pass" required />
            <br /><span id="error4" className="error" />
          </div>
        </div>
        <span id="error5" className="error" />
        <div className="button">
          <input type="submit" defaultValue="Register" id="mysubmit" />
        </div>
      </div>
      {/*------------------ registration form ends here------------------------------------*/}
    </div>
    <div className="signup1">
      <i style={{color: 'white'}}> Registered Already </i>
      {/*------------------link to login page  ------------------------------------*/}
     <Link to='/login'> <a href="/"><button className="btn">Sign in</button></a></Link>
    </div>
  </div>
  </div>
  )
}

