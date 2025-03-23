"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import SearchBar from "./SearchBar"
import "../styles/Header.css"

/**
 * Header component for iLoveRU application
 * Contains logo, navigation links, and search bar
 */
const Header = () => {
  const location = useLocation()
  const [activeLink, setActiveLink] = useState("")
  const { user, logout, isAdmin } = useAuth()

  // Update active link based on current path
  useEffect(() => {
    const path = location.pathname
    if (path === "/") {
      setActiveLink("feed")
    } else {
      const currentPath = path.split("/")[1]
      setActiveLink(currentPath)
    }
  }, [location])

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>iLoveRU</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <ul>
            <li className={activeLink === "feed" ? "active" : ""}>
              <Link to="/">Feed</Link>
            </li>
            <li className={activeLink === "news" ? "active" : ""}>
              <Link to="/news">News</Link>
            </li>
            <li className={activeLink === "favorites" ? "active" : ""}>
              <Link to="/favorites">Favorites</Link>
            </li>
            {isAdmin() && (
              <li className={activeLink === "admin" ? "active" : ""}>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Search Bar and User Menu */}
        <div className="header-right">
          <div className="search-container">
            <SearchBar />
          </div>

          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user?.nome}</span>
              <span className="user-role">{user?.role === "admin" ? "Administrador" : "Usuário"}</span>
            </div>
            <button className="logout-button" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

