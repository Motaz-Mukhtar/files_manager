// SignUp.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const API_URL = 'http://127.0.0.1:5000';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) setError('passwords do not match');

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${API_URL}/api/users`, { email, password }, headers);

      // Redirect to the Login page after successful SignUp
      history.push('/login');
    } catch (error) {
      console.log(error.message)
      setError('Error during signup');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
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
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />
        </label>
        <br />
        <button type="button" onClick={handleSignUp} className="submit-btn">
          Submit
        </button>
        <br />
        <Link to='/login'>Already Have an Account ? </Link>
      </form>
    </div>
  );
};

export default SignUp;
