import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios';
import './signup.css'

function signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Sign up with:', formData)


    try{
      const res = await axios.post('http://localhost:3000/api/signup', formData);
      console.log(res.data);
      alert('Signup successful');
    } catch(err){
      console.error('SignUp failed: ',err);
      alert('Signup failed')
    }
  }

  const handleGoogleSignUp = () => {
    console.log('Continue with Google')
    // Handle Google sign up logic here
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-logo">
            <div className="signup-logo-icon">
              <svg className="calculator-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
              </svg>
            </div>
            <span className="signup-logo-text">SplitIt</span>
          </div>
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">Join thousands of users who split bills with ease</p>
        </div>

        {/* Sign Up Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Name Fields - Side by Side */}
          <div className="name-row">
            <div className="form-group half-width">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div className="form-group half-width">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Create a password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            <p className="password-hint">Password must be at least 6 characters long</p>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-group">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" required />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and{' '}
                <a href="#" className="terms-link">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
      </div>
    </div>


  )
}

export default signup