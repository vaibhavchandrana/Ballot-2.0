import React, { useEffect } from "react";
import "../css/profile.css";
import bar from "../images/bar.png";
import bharat from "../images/bharat.png";
import axios from "axios";
export const Profile = () => {
  useEffect(() => {
    const url =
      "https://bright-calf-miniskirt.cyclic.app/employee/get/societies/all";
    const data = {
      name: "John Doe",
      email: "johndoe@example.com",
      message: "Hello, Axios!",
    };
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQzNDI1NzN9.fE3n1hCItdEx0KZ8jHIpPfDOyWxbBwMm8HEttVonilA"; // Replace with your actual auth token

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios
      .get(url, headers)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <div className="profile_body">
      <div className="ring1" />
      {/*------------------card for profile start here------------------------------------*/}
      <div className="profile-card">
        <center>
          <img src={bharat} alt="" className="img1" />
        </center>
        <p>Election commission of India</p>
        <br />
        <p>ELECTORS PHOTO IDENTITY CARD</p>
        {/*------------------user profile photo ------------------------------------*/}
        <center>
          <img
            src="https://cdn.xxl.thumbs.canstockphoto.fr/silhouette-hommes-costume-noir-clipart-vecteur_csp6923810.jpg"
            alt=""
            id="img2"
            style={{ marginTop: "5%" }}
          />
        </center>
        <br />
        <center>
          <img src={bar} alt="" id="img3" />
        </center>
        <form>
          <center>
            <div className="form"> Voter id : 151232 </div>
          </center>
        </form>
        <div className="pf_detail">
          <div className="form">
            <br />
            Name : Vaibhav Rana <br />
            <br />
            Email : Vaibhav@gmail.com <br />
            <br />
            Age : 21
            <br />
            <br />
            Phone No : 1234567890
            <br />
            <br />
          </div>
        </div>
      </div>
      <div className="ring2" />
    </div>
  );
};
