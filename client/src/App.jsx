import React, { Component } from 'react';
import { Router, Routes, Route } from 'react-router';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import SignUp from './Pages/SignUp/index';
import Login from './Pages/Login/index';
import FileContent from './components/FileBrowser/FileContent';
import PageNotFound from './Pages/PageNotFound/index';
import { NotificationProvider } from './context/NotificationContext';
import { ExplorerProvider } from './context/BrowserContext';
import Explorer from './components/Explorer';

function App() {
  return (
    <>
      <NotificationProvider>
        <Header />
          <ExplorerProvider>
            <Routes>
              {/* Home Route */}
              <Route path='/' element={<Home />} />

              {/* Main App Routes */}
              <Route path='/files' element={<Explorer />} />

              <Route path='/folders/:folderId' element={<Explorer />}/>
              {/* Not done yet */}
              {/* <Route path='/file/:fileId/data' element={<FileContent />} /> */}


              {/* Auth Routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ExplorerProvider>
        <Footer />
      </NotificationProvider>
    </>
  );
}


export default App;
