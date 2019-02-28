import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import config from './config'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import { RestLink } from 'apollo-link-rest'
import { ApolloProvider, gql } from 'react-apollo'
import ApolloClient from 'apollo-boost'
const client = new ApolloClient({
  link: config.apiGateway.URL
})

const query = gql`
  query luke {
    person @rest(type: "Person", path: "people/1/") {
      name
    }
  }
`

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'testApiCall',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
