import { useNavigate } from 'react-router-dom'
import './navbar.css'

function Navbar({ activeItem = '' }) {
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg className="calculator-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
          </div>
          <span className="navbar-logo-text">SplitIt</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <button 
            className={`nav-button ${activeItem === 'groups' ? 'active' : ''}`}
            onClick={() => navigate('/signin')}
          >
            Your Groups
          </button>
          <button 
            className={`nav-button ${activeItem === 'create' ? 'active' : ''}`}
            onClick={() => navigate('/signin')}
          >
            Create Group
          </button>
          <button 
            className={`nav-button ${activeItem === 'expense' ? 'active' : ''}`}
            onClick={() => navigate('/signin')}
          >
            Add Expense
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar