import React, { Component } from 'react'
import { PageHeader, ListGroup } from 'react-bootstrap'
import { API } from 'aws-amplify'
import { jwtVerify } from '../verifyJWT'
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

  testApiCall(_path) {
    // Auth.currentCredentials(credentials => {
    //   const tokens = Auth.essentialCredentials(credentials)
    //   console.log(tokens)
    // })
    let apiName = 'testApiCall'
    let path = _path
    let myInit = {
      // OPTIONAL
      headers: {
        // 'content-type': 'application/json',
        Authorization:
          'eyJraWQiOiJySzVGSEd0WjdPWkJYN1Y2VEdlSzhHQUg5K2ZPTGNqdzVGSXYza09SWHd3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyNzU3NDUyZi00MGU3LTQ1ZDItYjY1MS1iMzc4YTlhZmVmZGQiLCJhdWQiOiIxZHRsaDB0Y24wODlxM284M2g1YzUybWl2ZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjBjZmVkMWM1LTNiNDEtMTFlOS04NmI2LTVmOTgwZDgzMWU0OCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUxMzQ4NjE4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV91d2Y0QTVNOGEiLCJuYW1lIjoicGhpbGlwcCIsImNvZ25pdG86dXNlcm5hbWUiOiJzY2htaWRwaGlsaXBwMTk5NUBnbWFpbC5jb20iLCJleHAiOjE1NTEzNTIyMTgsImlhdCI6MTU1MTM0ODYxOCwiZW1haWwiOiJzY2htaWRwaGlsaXBwMTk5NUBnbWFpbC5jb20ifQ.blAFm1TlzA5IV3namDNJc5zss-_ulM-bcuWnFqZPfrQ970eJnmD4ak9Wkw9xsCMvoSRxk-bs38pa9rF2f3ZoFJI_6B0RHlluoJHMqO2F2SEFBivvO7LiUaxENOn81eUQP_P1nqpHLgfSJDKAn_6bom0pqxcKCrMs9YXuDGBnqj-EMKxefWUqsojTTIhry7mFUYzEzEAKJzDk0utbgKvy2rm4hZvqEEfmC540s2NLEoDJCOfVw3QPi_0ZjbN9v0V_kxXWBDL6nBbneVq62jLg69ynrTnMHGj8WwlSTBB96JvebyYXM_jhxY_bNKgQ_IpIZBocP4wD_SqopIhiAxTgag'
      }, // OPTIONAL
      response: true // OPTIONAL (return the entire Axios response object instead of only response.data)
    }

    return API.get(apiName, path, myInit)
      .then(async response => {
        if (response.data) {
          const res = await jwtVerify(JSON.parse(response.data.body).token)
          console.log(res)
          return res
        }
        return response
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
            const x = await this.testPostCallWoCre('/hello2')
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
        <ListGroup>
          {!this.state.isLoading && this.renderTestAPI(this.state.testApiCall)}
        </ListGroup>
        <div />
        <button
          onClick={async () => {
            const x = await this.testApiCall('/test')
            this.setState({ message: x })
          }}
        >
          Lambda function
        </button>
        <br />
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
