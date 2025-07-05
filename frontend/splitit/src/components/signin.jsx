import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './signin.css'

function signin() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
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
    console.log('Sign in with:', formData)

    try{
      const res = await axios.post('http://localhost:3000/api/signin', formData);
      console.log(res.data);
      // alert('Login successful');
      navigate('/addexpense');
    } catch(err){
      console.error('SignUp failed: ',err);
      alert('Wrong Credentials')
    }
  }

  const handleGoogleSignIn = () => {
    console.log('Continue with Google')
    // Handle Google sign in logic here
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        {/* Header */}
        <div className="signin-header">
          <div className="signin-logo">
            <div className="signin-logo-icon">
              <svg className="calculator-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
              </svg>
            </div>
            <span className="signin-logo-text">SplitIt</span>
          </div>
          <h1 className="signin-title">Welcome Back</h1>
          <p className="signin-subtitle">Sign in to continue splitting bills with ease</p>
        </div>

        {/* Sign In Form */}
        <form className="signin-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">or</span>
        </div>

        {/* Google Sign In */}
        <button type="button" className="google-button" onClick={handleGoogleSignIn}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <div className="signup-link">
          <p>Don't have an account? <button className="signup-text" onClick = {()=> navigate('/signup')}>Sign up</button></p>
        </div>
      </div>
    </div>
  )
}

export default signin