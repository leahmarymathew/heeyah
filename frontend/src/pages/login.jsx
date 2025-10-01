import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// CSS styles are embedded here to avoid import errors
const LoginPageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

    .login-page-container {
      display: flex;
      min-height: 80vh;
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
      max-width: 400px; /* Limits the width of the form area */
      margin: auto 0; /* Vertically centers the form in the available space */
    }

    .login-main-content h1 {
      /* Hostel Management title styles as requested */
      color: #3751FE;
      font-size: 36px;
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      word-wrap: break-word;
      margin: 0;
    }
    
    .login-main-content .welcome-text {
      color: #6c757d; /* A softer gray for the subtitle */
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

    .login-form input[type="text"],
    .login-form input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      box-sizing: border-box; /* Important for padding and width to work together */
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .login-form input[type="text"]:focus,
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

    .login-button:hover {
      background-color: #2a41d6; /* A slightly darker blue */
    }

    .login-image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa; /* Light gray placeholder background */
      padding: 40px;
    }
    
    /* This is a placeholder for your image */
    .image-placeholder {
        width: 100%;
        height: 100%;
        max-width: 600px;
        background-image: url('https://storage.googleapis.com/upload/prod/2282245_2024-09-08_15-46-24_image_475ef1.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .login-image-container {
        display: none; /* Hide the image on smaller screens */
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

// Regex for student roll number: 4-digit year (2022-2025) + Course Code (BEC/BCS/BCD/BCY/CS/CD/CY) + 4-digit number.
const studentRollNumberRegex = /^202[2-5](BEC|BCS|BCD|BCY|CS|CD|CY)\d{4}$/i;

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    const input = identifier.trim();

    // 1. Warden Login Check: email ending with @iiitkottayam.ac.in
    if (input.toLowerCase().endsWith('@iiitkottayam.ac.in')) {
      // In a real app, you'd check password here. Assuming success for demo.
      navigate('/warden-dashboard');
      return;
    }

    // 2. Student Login Check: roll number pattern
    if (studentRollNumberRegex.test(input)) {
        // In a real app, you'd check password here. Assuming success for demo.
        navigate('/student-dashboard');
        return;
    }

    // 3. Invalid credentials
    setError('Invalid Roll Number/Email or Password. Please check your credentials.');
  };

  return (
    <>
      <LoginPageStyles />
      <div className="login-page-container">
        {/* Left Side: Content and Form */}
        <div className="login-content-wrapper">
          <main className="login-main-content">
            <h1>Hostel Management</h1>
            <p className="welcome-text">Welcome back! Please login to your account.</p>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="identifier">Roll Number or Email</label>
                <input 
                  type="text" 
                  id="identifier" 
                  name="identifier" 
                  placeholder="2024CS0042 or swalih@iiitkottayam.ac.in" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  required
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                    <input type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember" style={{ marginBottom: 0, fontWeight: 'normal' }}>Remember Me</label>
                </div>
              </div>
              <button type="submit" className="login-button">Login</button>
              {error && <p className="error-message">{error}</p>}
            </form>
          </main>
        </div>
        {/* Right Side: Image Placeholder */}
        <div className="login-image-container">
            <div className="image-placeholder">
            </div>
        </div>
      </div>
    </>
  );
}