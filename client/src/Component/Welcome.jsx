import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <h1>Welcome to Your File Managment</h1>
        <p>Manage and organize your files with ease.</p>
      </div>

      <main>
        <Link to="/files" className="btn">
          View Your Files List
        </Link>
      </main>
    </div>
  );
};

export default Welcome;
