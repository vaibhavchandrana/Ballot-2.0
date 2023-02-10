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
          <li><a href="{% url 'signup' %}">Register</a></li>
          <li><a className="active" href="{% url 'index' %}">Home</a></li>
          <li><a href="{% url 'profile' %}">Profile</a></li>
          <li><a href="{% url 'voting' %}">Voting Area</a></li>
          <li><a href="{% url 'result' %}">Result</a></li>
          <li><a href="{% url 'logout' %}">Logout </a></li>
        </ul>
      </nav>
    </div>
  )
}
