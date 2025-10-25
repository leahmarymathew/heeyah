import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed axios as it's no longer needed for login here
import { supabase } from '../supabase'; // Import the Supabase client
import { AuthContext } from '../context/AuthContext';

// Import your local images from the assets folder
import loginIllustration from '../assets/login-illustration.png'; // Assuming PNG
import heeyahLogo from '../assets/heeyah-logo.png'; // Assuming PNG

// Your embedded CSS styles remain exactly the same
const LoginPageStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

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
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      word-wrap: break-word;
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

    .login-form input[type="text"],
    .login-form input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      box-sizing: border-box;
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
      opacity: 1;
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
  const [identifier, setIdentifier] = useState(''); // This should now be the user's EMAIL
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // We still use context to update app state if needed, Supabase handles the session
  const { login } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // --- Use Supabase Auth Client directly ---
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier, // Supabase Auth requires email
        password: password,
      });

      if (signInError) {
        throw signInError; // Let catch block handle Supabase errors
      }

      // Supabase login successful. The onAuthStateChange listener in AuthContext
      // will automatically update the global user state. 
      // We call login here just in case immediate state update is needed, though it might be redundant.
      if (data.session && data.user) {
         login(data.session.access_token, data.user); 
      }
       
      // --- Navigation ---
      // Navigate to the main dashboard after Supabase confirms login. 
      // The dashboard or layout components should handle role-specific UI.
      navigate('/dashboard'); 

    } catch (err) {
      console.error('Login failed:', err);
      // Use the error message from Supabase if available
      setError(err.message || 'Login failed. Please check your credentials.'); 
    } finally {
      setLoading(false);
    }
  };

  // --- JSX Structure remains exactly the same ---
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
                {/* Changed label for clarity since Supabase uses email */}
                <label htmlFor="identifier">Email</label>
                <input 
                  type="text" // Keep as text to allow email format
                  id="identifier" 
                  name="identifier" 
                  placeholder="user@iiitkottayam.ac.in" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required // Added required attribute
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
                  required // Added required attribute
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember" style={{ marginBottom: 0, fontWeight: 'normal' }}>Remember Me</label>
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

