import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Assuming axios is used for HTTP requests
import "../../css/signin.css";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";
const AdminRegistration = () => {
  const url = backendUrl();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { fullName, email, phoneNumber, password, confirmPassword } =
      formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${url}/admin/register/`, {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        password: password,
      });
      toast.success("Registration successful");
      navigate("/admin_login");
    } catch (error) {
      toast.error("Registration failed: " + error.message);
      // Handle error
    }
  };

  return (
    <div className="body">
      <div className="container extra">
        <div className="title">Admin Registration</div>
        <div className="content">
          <form
            className="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="user-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="fullName"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  placeholder="Enter your number"
                  name="phoneNumber"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="button">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
        <div className="signup1">
          <i>Registered Already</i>
          <Link to="/admin_login">
            <button className="btn">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
