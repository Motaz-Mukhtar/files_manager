import logo from '../logo.svg';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Welcome from './Welcome';
import FilesList from './FilesList';
import Footer from './Footer';
import SignUp from '../Pages/SignUp/index';
import Login from '../Pages/Login/index';
import FileContent from './FileContent';
import PageNotFound from '../Pages/PageNotFound/index';
import './App.css';
import './FilesList.css';
import './Header.css';
import './Welcome.css'
import './Footer.css'
import './FileContent.css';

function App() {
  return (
    <div className="App">
      <Header />
       <Router>
        <Switch>
          <Route path='/' exact component={Welcome} />
          <Route path='/files' component={FilesList} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />
          <Route path='/file/:fileId/data' component={FileContent} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}


export default App;
