import config from './config'
var jwt = require('jsonwebtoken')
var jwkToPem = require('jwk-to-pem')
const JWKs = `https://cognito-idp.${config.cognito.REGION}.amazonaws.com/${
  config.cognito.USER_POOL_ID
}/.well-known/jwks.json`

export const jwtVerify = async token => {
  var jwk = await fetch(JWKs).then(function(response) {
    return response.json()
  })
  console.log(jwk)
  const pem = await jwkToPem(jwk.keys[0])
  return await jwt.verify(token, pem, { algorithms: ['RS256'] }, function(
    err,
    decodedToken
  ) {
    return err ? err : decodedToken
  })
}
