import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import loginIllustration from '../assets/login-illustration.png';
import heeyahLogo from '../assets/heeyah-logo.png';

// Styles
const LoginPageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

    .login-page-container {
      display: flex;
      min-height: 100vh;
      width: 100%;
      font-family: 'Open Sans', sans-serif;
      background-color: #fff;
    }

    .login-content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 40px 60px;
    }
    
    .login-header {
      margin-bottom: 80px;
    }

    .login-main-content {
      width: 100%;
      max-width: 400px;
      margin: auto 0;
    }

    .login-main-content h1 {
      color: #3751FE;
      font-size: 36px;
      font-weight: 700;
      margin: 0;
    }
    
    .login-main-content .welcome-text {
      color: #6c757d;
      font-size: 16px;
      margin-top: 12px;
      margin-bottom: 40px;
    }

    .login-form .form-group {
      margin-bottom: 24px;
    }

    .login-form label {
      display: block;
      color: #495057;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .login-form input[type="email"],
    .login-form input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .login-form input[type="email"]:focus,
    .login-form input[type="password"]:focus {
      outline: none;
      border-color: #3751FE;
      box-shadow: 0 0 0 3px rgba(55, 81, 254, 0.2);
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #6c757d;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .remember-me input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    .login-button {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      background-color: #3751FE;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 24px;
      transition: background-color 0.3s;
    }

    .login-button:disabled {
      background-color: #aeb8fe;
      cursor: not-allowed;
    }

    .login-button:hover:not(:disabled) {
      background-color: #2a41d6;
    }

    .login-image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      padding: 40px;
    }

    .login-image-container img {
      width: 100%;
      height: auto;
      max-width: 600px;
    }

    @media (max-width: 992px) {
      .login-image-container {
        display: none;
      }
      .login-content-wrapper {
        padding: 40px 30px;
      }
    }

    .error-message {
      color: #dc3545;
      margin-top: 10px;
      font-size: 14px;
      text-align: center;
    }
  `}</style>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Helper function to redirect based on user role
  const redirectUser = (user) => {
    switch (user.role) {
      case 'student':
        navigate('/attendance');
        break;
      case 'warden':
        navigate('/warden-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Please enter your email');
      }

      console.log('Attempting simple login for:', email);
      
      // Use our simple login system
      const userData = await login(email, password);
      
      console.log('Login successful:', userData);
      
      // Redirect based on user role
      redirectUser(userData);
      
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginPageStyles />
      <div className="login-page-container">
        <div className="login-content-wrapper">
          <header className="login-header">
            <img src={heeyahLogo} alt="Heeyah Logo" style={{ height: '40px' }} />
          </header>
          <main className="login-main-content">
            <h1>Hostel Management</h1>
            <p className="welcome-text">Welcome back! Please login to your account.</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="user@iiitkottayam.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autocomplete="off"
                  data-form-type="other"
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember" style={{ marginBottom: 0, fontWeight: 'normal' }}>
                    Remember Me
                  </label>
                </div>
              </div>
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          </main>
        </div>
        <div className="login-image-container">
          <img src={loginIllustration} alt="Hostel management illustration" />
        </div>
      </div>
    </>
  );
}
