// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Login.css';
import { useBrowser } from '../../context/BrowserContext';
import CircularLoading from '../../components/UI/CircularLoading'

const API_URL = 'http://127.0.0.1:5000';

function Login() {
  // Contexts
  const { loading, setLoading } = useBrowser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // React Router hooks
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = {
        headers: {
          "Authorization": `Basic ${btoa(`${email}:${password}`)}`,
        },
      };

      const response = await axios.get(`${API_URL}/api/connect`, data);

      // The API returns a token on successful login.
      const token = response.data.token;

      // Store the token in a cookie.
      Cookies.set('token_id', token);

      // Redirect to the file list page after successful login.
      navigate('/files');
    } catch (error) {
      console.log(error.message)
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div>
        <h2>Login </h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      
      {
        loading &&
          <CircularLoading />
      }

      { !loading && 
        <form onKeyUp={(e) => e.key === 'Enter' ? handleLogin() : null}>
          <div className='flex flex-col'>
            <label>
              Email:
            </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-box"
              />
          </div>

          <br />
          <div className='flex flex-col'>
            <label className=''>
              Password:
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-box"
            />
          </div>
          <br />
          <button type="button" onClick={handleLogin} className="login-btn">
            Login
          </button>
          <br />
          <Link to='/signup'>
            <span className='text-blue-600 underline hover:underline-offset-0'>
              Don't Have an Account ?
            </span>
          </Link>
        </form>
      }
    </div>
  );
};

export default Login;
