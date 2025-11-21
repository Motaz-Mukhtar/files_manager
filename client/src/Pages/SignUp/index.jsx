// SignUp.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import './SignUp.css';

const API_URL = 'http://127.0.0.1:5000';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) setError('passwords do not match');

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${API_URL}/api/users`, { email, password }, headers);

      // Redirect to the Login page after successful SignUp
      navigate('/login');
    } catch (error) {
      console.log(error.message)
      setError('Error during signup');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form className='flex flex-col'>
      <div className='flex flex-col my-5'>
        <label>
          Email:
        </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box"
            required
          />
      </div>
      <div className='flex flex-col my-5'>
          <label>
            Password:
          </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
              required
            />
      </div>


      <div className='flex flex-col my-5'>
        <label>
          Confirm Password:
        </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-box"
            required
          />
      </div>


        <button type="button" onClick={handleSignUp} className="submit-btn">
          Submit
        </button>


        <Link to='/login'>
          <span className='text-blue-600 underline hover:underline-offset-0'>
            Already Have an Account ?
          </span>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
