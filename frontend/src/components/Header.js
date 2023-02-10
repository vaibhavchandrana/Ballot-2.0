import React from 'react'
import '../css/voting_navbar.css'

export const Header = () => {
  return (
    <div>
        <nav>
        <div className="logo">Ballot</div>
        <input type="checkbox" id="click" />
        <label htmlFor="click" className="menu-btn">
          <i className="fas fa-bars" />
        </label>
        <ul>
          <li><a href="/">Register</a></li>
          <li><a className="active" href="/">Home</a></li>
          <li><a href="/">Profile</a></li>
          <li><a href="/">Voting Area</a></li>
          <li><a href="/">Result</a></li>
          <li><a href="/">Logout </a></li>
        </ul>
      </nav>
    </div>
  )
}
