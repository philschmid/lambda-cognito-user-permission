import config from './config'
var jwt = require('jsonwebtoken')
var jwkToPem = require('jwk-to-pem')

export const jwtVerify = async token => {
  var jwk = await fetch(config.JWKs).then(function(response) {
    return response.json()
  })
  const pem = await jwkToPem(jwk.keys[0])
  return await jwt.verify(token, pem, { algorithms: ['RS256'] }, function(
    err,
    decodedToken
  ) {
    return decodedToken
  })
}
