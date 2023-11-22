import React, { useState } from "react";
import "../../css/signin.css";
import { Link } from "react-router-dom";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const Login = () => {
  const [email, setEmail] = useState("vaibhav@ballot.com");
  const [password, setPassword] = useState("test@123");
  const [errorMessage, setErrorMessage] = useState("");
  const url = backendUrl();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!email || !password) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    // Create the payload
    const payload = {
      email: email,
      password: password,
    };

    try {
      // Make the API call to send the login data to the server
      const response = await fetch(`${url}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Login successful, perform any necessary actions (e.g., redirect)
        toast.success("Login successful");
        localStorage.setItem("ballot_profile", email);
        localStorage.setItem("ballot_login_as", "user");
        navigate("/");
      } else {
        // Login failed, handle the error
        console.error("Login failed:", response.status);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="title">Login</div>
        <br />
        <div className="content">
          {/* <!-------------------- form  start here--------------------------------------> */}

          <form className="form" onSubmit={handleLogin}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  type="email"
                  placeholder="Enter your Username(Email)"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <br />
              <br />
              <br />
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="button">
              <input type="submit" name="signin" value="Login" />
            </div>
          </form>
          {/* <!---------------------------- form ends here--------------------------------------------> */}

          <div className="signup1">
            <i style={{ color: "black" }}> Visting for the first time?</i>
            <Link to="/signup">
              <a href="/">
                <button className="btn">Sign up</button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
