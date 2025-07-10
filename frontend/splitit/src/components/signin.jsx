import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
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

      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('userEmail', res.data.user.email || '');
      // localStorage.setItem('userImage', res.data.user.image || ''); 
      localStorage.setItem('userId', res.data.user.id || '');
      localStorage.setItem('firstName', res.data.user.firstName || '');
      localStorage.setItem('lastName', res.data.user.lastName || '');

      navigate('/yourgroups');
    } catch(err){
      console.error('SignUp failed: ',err);
      alert('Wrong Credentials')
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post('http://localhost:3000/api/google-signin', {
      token: credentialResponse.credential
    });

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', res.data.user.id || ''); 
    localStorage.setItem('userEmail', res.data.user.email || '');
    localStorage.setItem('firstName', res.data.user.firstName || '');
    localStorage.setItem('lastName', res.data.user.lastName || '');
    // localStorage.setItem('userImage', res.data.user.image || '');

    navigate('/yourgroups');
  } catch (err) {
    console.error('Google SignIn failed: ', err);
    alert('Google SignIn failed');
  }
};


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
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Sign In Failed");
              alert("Google Sign In Failed");
            }}
          />
        </div>

        {/* Sign Up Link */}
        <div className="signup-link">
          <p>Don't have an account? <button className="signup-text" onClick = {()=> navigate('/signup')}>Sign up</button></p>
        </div>
      </div>
    </div>
  )
}

export default signin