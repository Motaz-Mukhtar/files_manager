// Login.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Login.css';

const API_URL = 'http://127.0.0.1:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
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
      history.push('/files');
    } catch (error) {
      console.log(error.message)
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div>
        <h2>Login </h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin} className="login-btn">
          Login
        </button>
        <br />
        <Link to='/signup'>Don't Have an Account ?</Link>
      </form>
    </div>
  );
};

export default Login;
