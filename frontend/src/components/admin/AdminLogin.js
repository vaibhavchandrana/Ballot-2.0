import React, { useState } from "react";
import "../../css/signin.css";
import { Link } from "react-router-dom";
import axios from "axios"; // Assuming axios is used for HTTP requests
import { backendUrl } from "../../backendUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const [email, setEmail] = useState("vaibhavrana@admin.com");
  const [password, setPassword] = useState("test@123");
  const url = backendUrl();
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/admin/login/`, {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem("ballot_admin_id", response.data.id);
      localStorage.setItem("ballot_login_as", "admin");
      toast.success("Login Successfull");
      navigate("/admin/electionList");
    } catch (error) {
      toast.error("Unable to login. Please retry");
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="title">Admin Login</div>
        <div className="content">
          <form className="form" onSubmit={handleLogin}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  type="email"
                  placeholder="Enter your Username (Email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="button">
              <input type="submit" value="Login" />
            </div>
          </form>
          <div className="signup1">
            <i> Visiting for the first time?</i>
            <Link to="/admin_registration">
              <button className="btn">Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
