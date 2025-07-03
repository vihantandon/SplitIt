import { Calculator, Users, Smartphone } from 'lucide-react'
import './landing.css'
import {useNavigate} from 'react-router-dom'

function landing() {

const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="calculator-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
              </svg>
            </div>
            <span className="logo-text">SplitIt</span>
          </div>
          <div className="nav-buttons">
            <button className="nav-button" onClick={() => navigate('/signin')}>Your Groups</button>
            <button className="nav-button" onClick={() => navigate('/signin')}>Create Group</button>
            <button className="nav-button" onClick={() => navigate('/signin')}>Add Expense</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Split Bills Like a Pro</h1>
          <p className="hero-subtitle">
            The easiest way to split bills with friends, roommates, and groups. Track expenses, settle debts, and keep
            everyone happy.
          </p>
          <button className="cta-button" onClick={() => navigate('/signin')}>Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Use SplitIt?</h2>

          <div className="features-grid">
            {/* Smart Calculations */}
            <div className="feature-card">
              <div className="feature-icon-container">
                <Calculator className="feature-icon" />
              </div>
              <h3 className="feature-title">Smart Calculations</h3>
              <p className="feature-description">
                Let us handle the complex math with our intelligent splitting algorithms. No more manual math or
                confusion.
              </p>
            </div>

            {/* Group Management */}
            <div className="feature-card">
              <div className="feature-icon-container">
                <Users className="feature-icon" />
              </div>
              <h3 className="feature-title">Group Management</h3>
              <p className="feature-description">
                Easily manage groups with friends, roommates, dinner parties, and more. Keep everything organized.
              </p>
            </div>

            {/* Mobile Friendly */}
            <div className="feature-card">
              <div className="feature-icon-container">
                <Smartphone className="feature-icon" />
              </div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-description">
                Works perfectly on all devices. Add expenses on the go and settle up anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Split Smart?</h2>
          <p className="cta-subtitle">
            Join thousands of users who have simplified their shared expenses.
          </p>
          <button className="cta-button" onClick={() => navigate('/signin')}>Start Splitting Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="footer-icon">
              <span>📊</span>
            </div>
            <span className="footer-text">SplitIt</span>
          </div>
          <p className="footer-copyright">© 2024 SplitIt. Making bill splitting simple and fair.</p>
        </div>
      </footer>
    </div>
  )
}

export default landing