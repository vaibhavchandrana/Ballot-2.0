import React from 'react'
import '../css/profile.css'
import bar from "../images/bar.png"
import bharat from "../images/bharat.png"
export const Profile = () => {
  return (
    <div className='profile_body'>
      <div className="ring1" />
      {/*------------------card for profile start here------------------------------------*/}
      <div className="profile-card">
        <center><img src={bharat} alt="" className="img1" /></center>
        <p>Election commission of India</p><br />
        <p>ELECTORS PHOTO IDENTITY CARD</p>
        {/*------------------user profile photo ------------------------------------*/}
        <center><img src="https://cdn.xxl.thumbs.canstockphoto.fr/silhouette-hommes-costume-noir-clipart-vecteur_csp6923810.jpg" alt="" id="img2" style={{ marginTop: '5%' }} /></center>
        <br />
        <center><img src={bar} alt="" id="img3" /></center>
        <form>
          <center><div className='form'> Voter id : 151232 </div></center>
        </form>
        <div className="pf_detail">
          <div className='form'>
            <br />
            Name : Vaibhav Rana <br /><br />
            Email : Vaibhav@gmail.com <br /><br />
            Age : 21<br /><br />
            Phone No : 1234567890<br /><br />
          </div>
        </div>
      </div>
      <div className="ring2" />
    </div>
  )
}

