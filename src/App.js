//import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';
//import { Navbar, Jumbotron, Button } from 'react-bootstrap';
//
//class App extends Component {
//  render() {
//    return (
//      <div className="App">
//        <header className="App-header">
//          <img src={logo} className="App-logo" alt="logo" />
//          <h1 className="App-title">Welcome to React</h1>
//        </header>
//        <p className="App-intro">
//          To get started, edit <code>src/App.js</code> and save to reload.
//        </p>
//      </div>
//    );
//  }
//}
//
//export default App;

import React from 'react';
import { Grid, Navbar, Jumbotron, Nav, NavItem } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import UserLayout from './user/UserLayout';
import RoleLayout from './role/RoleLayout';

const Layout = () => (
   <div>
     <Navigation />
     <div className="container">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/user' component={UserLayout}/>
          <Route exact path='/role' component={RoleLayout}/>
        </Switch>
     </div>
   </div>
 )

const Navigation = () => (
    <Navbar inverse>
      <Grid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Start</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="user">Användare</NavItem>
              <NavItem eventKey={2} href="role">Roller</NavItem>
            </Nav>
      </Grid>
    </Navbar>
)

const Home = () => (
    <Jumbotron>
      <Grid>
        <p>Användare och rollhantering</p>
      </Grid>
    </Jumbotron>
)


export default Layout;

