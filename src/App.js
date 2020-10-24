import React from 'react';
import './App.css';
import Landing from './pages/landing';
import Customer from './pages/cust';
import Driver from './pages/driver';
import Admin from './pages/admin';


import  { Route, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route exact path = "/customer" component = {Customer}/>
      <Route exact path = "/driver" component = {Driver}/>
      <Route exact path = "/admin" component = {Admin}/>
      <Route exact path = "/" component = {Landing}/>

    </div>
    </BrowserRouter>
  );
}

export default App;
