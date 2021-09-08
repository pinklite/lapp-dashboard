const e = require('express')
const tr = require('tor-request')
require('dotenv').config()

const getOnion = (onion, callback, macaroon = '') => {
  let options = {
    url: onion,
    strictSSL: false,
    agentClass: require('socks5-https-client/lib/Agent'),
    agentOptions: {
      socksHost: process.env.TOR_HOST || 'localhost',
      socksPort: process.env.TOR_PORT || 9050,
    }
  }
  if (macaroon.length > 0) {
    options.headers = { 'Grpc-Metadata-macaroon': macaroon }
  }
  tr.request(options, (err, res) => {
    if (err) {
      console.error(err)
      return callback(false)
    } else if (res.statusCode === 200) {
      return callback(true)
    } else if (res) {
      console.log(res.statusCode)
    }
    return callback(false)
  })
}

module.exports = getOnion