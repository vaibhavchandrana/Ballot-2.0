import React from 'react'
import '../css/voting_navbar.css'
import { Link } from 'react-router-dom';
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
          <li><a href="/"> <Link to='login'>Login</Link></a></li>
          <li><a  href="/"><Link to='/'>Home</Link></a></li>
          <li><a href="/"><Link to='profile'>Profile </Link ></a></li>
          <li><a href="/"><Link to='voting'>Voting Area</Link></a></li>
          <li><a href="/"><Link to='Result'>Result</Link></a></li>
          <li><a href="/"><Link to='login'>Logout </Link></a></li>
        </ul >
      </nav >
    </div >
  )
}
