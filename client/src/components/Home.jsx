import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="welcome-page text-center p-[50px] bg-transparent text-[#1dbba5]">
      <div className="welcome-container">
        <h1 className='m-0'>Welcome to Your File Managment</h1>
        <p className='mt-10'>Manage and organize your files with ease.</p>
      </div>

      <main className='mt-10'>
        <Link to="/files">
          <button className='btn'>
            View Your Files List
          </button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
