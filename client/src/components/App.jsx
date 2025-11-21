import logo from '../logo.svg';
import React, { Component } from 'react';
import { Router, Routes, Route } from 'react-router';
import Header from './Header';
import Home from './Home';
import FilesList from './FilesList';
import Footer from './Footer';
import SignUp from '../Pages/SignUp/index';
import Login from '../Pages/Login/index';
import FileContent from './FileContent';
import PageNotFound from '../Pages/PageNotFound/index';

function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/files' element={<FilesList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/file/:fileId/data' element={<FileContent />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      <Footer />
    </>
  );
}


export default App;
