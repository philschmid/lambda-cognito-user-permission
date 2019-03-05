import { LinkContainer } from 'react-router-bootstrap'
import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
import Routes from './Routes'
import { Auth } from 'aws-amplify'
import {
  CognitoUserPool,
  CognitoUser,
  CookieStorage
} from 'amazon-cognito-identity-js'
import config from './config'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    }
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true)
      }
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
      }
    }

    this.setState({ isAuthenticating: false })
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated })
  }

  handleLogout = async event => {
    // await Auth.signOut()
    var poolData = {
      UserPoolId: config.cognito.USER_POOL_ID, // Your user pool id here
      ClientId: config.cognito.APP_CLIENT_ID // Your client id here
    }
    var cognitoUser = new CognitoUserPool(poolData).getCurrentUser()
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, result) {
        if (result) {
          console.log('You are now logged in.')
          console.log(result.accessToken.payload.device_key)

          cognitoUser.forgetSpecificDevice(
            result.accessToken.payload.device_key,
            {
              onSuccess: function(result) {
                console.log('call result: ' + result)
              },
              onFailure: function(err) {
                alert(err.message || JSON.stringify(err))
              }
            }
          )
        }
      })
    }
    // cognitoUser.signOut()
    this.userHasAuthenticated(false)
    this.props.history.push('/login')
  }
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Test application</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated ? (
                <NavItem onClick={this.handleLogout}>Logout</NavItem>
              ) : (
                <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    )
  }
}

export default withRouter(App)
