import React, { Component } from 'react'
import { PageHeader, ListGroup } from 'react-bootstrap'
import { API } from 'aws-amplify'
import { jwtVerify } from '../verifyJWT'
import { Auth } from 'aws-amplify'

import './Home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      testApiCall: [],
      message: 'noch nichts'
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return
    }

    try {
      const testApiCall = await this.testApiCall()
      this.setState({ testApiCall })
    } catch (e) {
      alert(e)
    }

    this.setState({ isLoading: false })
  }

  async testApiCall(_path) {
    const aToken = await Auth.currentAuthenticatedUser().then(
      ({
        signInUserSession: {
          idToken: { jwtToken }
        }
      }) => {
        return jwtToken
      }
    )

    let apiName = 'testApiCall'
    let path = _path
    let myInit = {
      // OPTIONAL
      headers: {
        // 'content-type': 'application/json',
        Authorization: aToken
      }, // OPTIONAL
      response: true // OPTIONAL (return the entire Axios response object instead of only response.data)
    }
    return API.get(apiName, path, myInit)
      .then(async response => {
        console.log(JSON.parse(response.data.body))
        if (response.data) {
          console.log(JSON.parse(response.data.body).token)
          const res = await jwtVerify(JSON.parse(response.data.body).token)
          console.log(res)
          // return res
          return JSON.parse(response.data.body)
        }
      })
      .catch(error => {
        console.log(error.response)
        throw error
      })
  }
  testPostCallWoCre(_path) {
    return API.get('testApiCall', _path)
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Test web app</h1>
        <button
          onClick={async () => {
            const x = await this.testPostCallWoCre('/iamhello')
            console.log(x)
            this.setState({ message: x })
          }}
        >
          Lambda ohne Auth function
        </button>
        <p>A simple react test app</p>
      </div>
    )
  }

  renderTest() {
    return (
      <div className="test">
        <PageHeader>Test API call</PageHeader>
        <ListGroup>{!this.state.isLoading}</ListGroup>
        <div />
        <button
          onClick={async () => {
            const x = await this.testApiCall('/test')
            this.setState({ message: x.message })
          }}
        >
          Lambda function
        </button>
        <br />
        <div>{this.state.message}</div>
        <button
          onClick={async () => {
            const x = await this.testPostCallWoCre('/iamhello')
            console.log(x.message)
            this.setState({ message: x.message })
          }}
        >
          Lambda ohne Auth function
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderTest() : this.renderLander()}
      </div>
    )
  }
}
