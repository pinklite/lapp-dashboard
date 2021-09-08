const torFetch = require('torfetch')
require('dotenv').config()
let options = { hostname: process.env.TOR_HOST || 'localhost', port: process.env.TOR_PORT || 9050 }

const getOnion = (onion, callback, macaroon = '') => {
  if (macaroon.length > 0) {
    options.headers = { 'Grpc-Metadata-macaroon': macaroon }
  }
  if (macaroon.length === 0) {
    options = { hostname: process.env.TOR_HOST || 'localhost', port: process.env.TOR_PORT || 9050 }
  }
  const request = new torFetch(onion, options)
  request.on("headers", headers => {
    console.log(headers)
    if (headers.status === 200) return callback(true)
    return callback(false)
  })
  request.on("end", () => {
    console.log('Tor request attempt ended unsuccessfully')
    return callback(false)
  })
}

module.exports = getOnion