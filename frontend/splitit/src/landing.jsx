import { Calculator, Users, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/navbar'
import './landing.css'

function landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Use Navbar Component */}
      <Navbar />

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

export default landing;