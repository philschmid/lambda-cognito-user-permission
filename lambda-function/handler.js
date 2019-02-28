'use strict'

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Authenticated call!`,
      input: event,
      context,
      token: event.headers.Authorization
    })
  }

  callback(null, response)
}
// 'use strict'
// const omitEmpty = require('omit-empty')
// const _ = require('lodash')
// module.exports.hello = (event, context, callback) => {
//   console.log(JSON.stringify(event, null, 4))
//   const response = {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//       'Access-Control-Allow-Credentials': 'true'
//     },
//     body: JSON.stringify(
//       omitEmpty({
//         status: 'success',
//         input: event,
//         context
//       })
//     )
//   }
//   callback(null, response)
//   Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
// }
