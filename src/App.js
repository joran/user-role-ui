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
import {Index as Users} from './user/index';
import RoleLayout from './role/RoleLayout';

const Layout = () => (
   <div>
     <Navigation />
     <div className="container-fluid">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/user' component={Users}/>
          <Route exact path='/role' component={RoleLayout}/>
          <Route exact path='/about' component={About}/>
        </Switch>
     </div>
   </div>
 )

const Navigation = () => (
    <Navbar>
      <Grid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Anvädare och roller</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="user">Användare</NavItem>
              <NavItem eventKey={2} href="role">Roller</NavItem>
              <NavItem eventKey={3} href="about">Om</NavItem>
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

const About = () => (
    <div class="about container">
        <p>Det här är ett verktyg för att administrera användare och roller skrivet med hjälp av React.js</p>
        <p>Version: 0.1.0</p>
    </div>
)

export default Layout;

