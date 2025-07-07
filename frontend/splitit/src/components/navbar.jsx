import { useNavigate } from 'react-router-dom'
import { Calculator } from 'lucide-react'
import './navbar.css'
import { useState, useEffect } from 'react'

function Navbar({ activeItem = '' }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userImage, setUserImage] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const email = localStorage.getItem('userEmail') || ''
    const image = localStorage.getItem('userImage') || ''
    setIsLoggedIn(loggedIn)
    setUserEmail(email)
    setUserImage(image)
  }, [])

  function handleNavigation(path) {
    if (isLoggedIn) {
      navigate(path)
    } else {
      navigate('/signin')
    }
  }

  function handleLogout() {
    localStorage.clear()
    setIsLoggedIn(false)
    setShowDropdown(false)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbarcontainer">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="navbar-logo-icon">
            <Calculator size={24} strokeWidth={2} color='white'/>
          </div>
          <span className="navbar-logo-text">SplitIt</span>
        </div>

        {/* Right side with nav + user */}
        <div className="navbar-right">
          <div className="navbar-nav">
            <button
              className={`nav-button ${activeItem === 'groups' ? 'active' : ''}`}
              onClick={() => handleNavigation('/yourgroups')}
            >
              Your Groups
            </button>
            <button
              className={`nav-button ${activeItem === 'create' ? 'active' : ''}`}
              onClick={() => handleNavigation('/creategrp')}
            >
              Create Group
            </button>
            <button
              className={`nav-button ${activeItem === 'expense' ? 'active' : ''}`}
              onClick={() => handleNavigation('/addexpense')}
            >
              Add Expense
            </button>


            {/* Avatar and Logout */}
          <div className="navbar-user">
            <div
              className="user-avatar-wrapper"
              onClick={() => isLoggedIn && setShowDropdown(!showDropdown)}
            >
              {isLoggedIn ? (
                userImage ? (
                  <img src={userImage} alt="User" className="user-avatar" />
                ) : (
                  <div className="user-avatar initials">
                      {(localStorage.getItem('firstName')?.[0] || userEmail?.[0])?.toUpperCase()}
                </div>
                )
              ) : (
                <div className="user-avatar initials">
                  <svg viewBox="0 0 24 24" fill="#fff" width="24" height="24">
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.2 0-9.6 1.6-9.6 4.8v2.7h19.2v-2.7c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              )}
            </div>

            {isLoggedIn && (
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}

          </div>

        </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
