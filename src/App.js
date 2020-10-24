import React from 'react';
import './App.css';
import Landing from './pages/landing';
import Customer from './pages/cust';
import Driver from './pages/driver';
import Admin from './pages/admin';

import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import {StatefulInput} from 'baseui/input';
import  { Route, BrowserRouter } from 'react-router-dom'
const engine = new Styletron();
const Centered = styled('div', {
  height: '100%',
  width : '100%'
});

function App() {
  return (
    <StyletronProvider value={engine}>
    <BaseProvider theme={DarkTheme}>
      <Centered>
    <BrowserRouter>
    <div className="App">
      <Route exact path = "/customer" component = {Customer}/>
      <Route exact path = "/driver" component = {Driver}/>
      <Route exact path = "/admin" component = {Admin}/>
      <Route exact path = "/" component = {Landing}/>

    </div>
    </BrowserRouter>
      </Centered>
    </BaseProvider>
  </StyletronProvider>
  );
}

export default App;
