import React from "react";
import "../../css/voting_navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const Header = () => {
  const isAdmin = localStorage.getItem("ballot_login_as") == "admin";
  const navigate = useNavigate();
  function logoutFunc() {
    localStorage.removeItem("ballot_login_as");
    localStorage.removeItem("ballot_admin_id");
    localStorage.removeItem("ballot_newElectionID");
    localStorage.removeItem("ballot_profile");
    navigate("/login");
  }
  return (
    <div>
      <nav>
        <div className="logo">Ballot</div>
        <input type="checkbox" id="click" />
        <label htmlFor="click" className="menu-btn">
          <i className="fas fa-bars" />
        </label>
        <ul>
          <li>
            <a href="/">
              {" "}
              <Link to="login">Login</Link>
            </a>
          </li>
          <li>
            <a href="/">
              {" "}
              <Link to="admin_login">Admin</Link>
            </a>
          </li>
          <li>
            <a href="/">
              <Link to="/">Home</Link>
            </a>
          </li>
          <li>
            <a href="/">
              <Link to="profile">Profile </Link>
            </a>
          </li>
          <li>
            <a href="/">
              <Link to="voting">Voting Area</Link>
            </a>
          </li>

          <li>
            <a href="/">
              <span onClick={logoutFunc}>Logout </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
