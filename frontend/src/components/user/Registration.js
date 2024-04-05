import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CameraCapture from "./CameraCapture"; // Assuming this is your custom component for capturing images
import { Form } from "react-bootstrap";
import "../../css/signin.css";
import { backendUrl } from "../../backendUrl";

export const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [autoCaptureFlag, setAutoCaptureFlag] = useState(false);
  const [agreeToShareImage, setAgreeToShareImage] = useState(false);

  const url = backendUrl();

  const handleAutoClick = (e) => {
    e.preventDefault(); // Prevent form from submitting when validations fail
    if (
      !fullName ||
      !email ||
      !age ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeToShareImage) {
      setErrorMessage("Please agree to share your image.");
      return;
    }

    setAutoCaptureFlag(true);
  };

  useEffect(() => {
    const handleRegistration = async () => {
      if (image && agreeToShareImage && autoCaptureFlag) {
        try {
          const formData = new FormData();
          formData.append("full_name", fullName);
          formData.append("email", email);
          formData.append("age", age);
          formData.append("phone_number", phone);
          formData.append("password", password);
          formData.append("image", image);

          const response = await fetch(`${url}/register/`, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("Registration successful");
            // Redirect or update UI accordingly
          } else {
            console.error("Registration failed:", response.status);
          }
        } catch (error) {
          console.error("Error during registration:", error);
        }
      }
    };

    handleRegistration();
  }, [
    image,
    agreeToShareImage,
    autoCaptureFlag,
    fullName,
    email,
    age,
    phone,
    password,
    url,
  ]);

  return (
    <div className="body">
      <div className="container extra">
        <div className="title">Registration</div>
        <div className="content">
          <form className="form" encType="multipart/form-data">
            <div className="user-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  id="name"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <br />
                <span id="error1" className="error" />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Age</span>
                <input
                  type="text"
                  placeholder="Enter your age"
                  name="age"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
                <br />
                <span id="errorAge" className="error" />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  placeholder="Enter your number"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <br />
                <span id="error2" className="error" />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="pass"
                  name="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                <span id="error3" className="error" />
              </div>
              <div className="input-box">
                <span className="details">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  id="cpass"
                  name="c_pass"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <br />
                <span id="error4" className="error" />
              </div>
            </div>
            {/* Checkbox for Image Sharing Agreement */}
            <div className="input-box" id="checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                checked={agreeToShareImage}
                id="flexCheckDefault"
                onChange={() => setAgreeToShareImage(!agreeToShareImage)}
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Agree to share your image being saved
              </label>
            </div>

            {/* Error Message Display */}
            <span id="error5" className="error">
              {errorMessage}
            </span>

            {/* Registration Button */}
            <div className="button">
              <input
                type="submit"
                onClick={handleAutoClick}
                value="Register"
                id="mysubmit"
              />
            </div>
          </form>
        </div>
        {/* Show CameraCapture if flag is true */}
        {autoCaptureFlag && <CameraCapture setImage={setImage} />}

        {/* Link to Login Page */}
        <div className="signup1">
          <i style={{ color: "white" }}> Registered Already </i>
          <Link to="/login">
            <button className="btn">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
