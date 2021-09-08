const bcMini = require('../notify/blockClockMini')
const discordMessage = require('../notify/discord')
const resultDB = require('../monitoring/resultDB')
const torFetch = require('./torFetch')
const axios = require('axios')
const https = require('https')
const agent = new https.Agent({
  rejectUnauthorized: false
})

const handleSuccess = (prev, position, name) => {
  resultDB.storeNewResult(position, 'OK')
  if (prev === '1ST') {
    bcMini.update(name, 'OK', position)
  }
  if (prev === 'ERR') {
    if (process.env.USE_DISCORD === 'true') {
      discordMessage(`Service restored: ${name}`)
    }
    bcMini.update(name, 'OK', position)
  }
}

const handleError = (prev, position, name) => {
  resultDB.storeNewResult(position, 'ERR')
  if (prev === '1ST') {
    bcMini.update(name, 'ERR', position)
  }
  if (prev === 'OK' || typeof prev === undefined) {
    if (process.env.USE_DISCORD === 'true') {
      discordMessage(`Service INTERRUPTED: ${name}`)
    }
    bcMini.update(name, 'ERR', position)
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// When starting this app
// Pause automatic updates
bcMini.pause()

// Fill all digits with 'register' image
bcMini.fillEmpty()

const monitor = async (services) => {

  // Update corresponding display for each service
  for (const s of services) {
    await sleep(1000)

    resultDB.getLatestResult(s.position, prev => {
      // If clearnet
      if (s.url.substring(0,7) === 'http://' || s.url.substring(0,8) === 'https://') {
        if (s.type === 'WEB') {
          axios.get('/', {
            baseURL: s.url,
            timeout: 10000,
            httpsAgent: agent
          })
            .then(response => {
              // Since response code is in 200's here...
              handleSuccess(prev, s.position, s.name)
            })
            .catch(err => {
              // Parse error code...
              handleError(prev, s.position, s.name)
            })
        }
        if (s.type === 'LND') {
          axios.get('/v1/getinfo', {
            baseURL: s.url,
            timeout: 10000,
            headers: {
              'Grpc-Metadata-macaroon': s.macaroon
            },
            httpsAgent: agent
          })
            .then(response => {
              // Since response code is in 200's here...
              handleSuccess(prev, s.position, s.name)
            })
            .catch(err => {
              console.error(err)
              // Parse error code...
              handleError(prev, s.position, s.name)
            })
        }
      } else {
        // If tor 
        if (s.type === 'WEB') {
          torFetch(s.url, bool => {
            if (bool) {
              handleSuccess(prev, s.position, s.name)
            } else {
              handleError(prev, s.position, s.name)
            }
          })
        }
        if (s.type === 'LND') {
          console.log('Fetching via Tor: ', s.name)
          torFetch(s.url, bool => {
            if (bool) {
              handleSuccess(prev, s.position, s.name)
            } else {
              handleError(prev, s.position, s.name)
            }
          }, s.macaroon)
        }
      }
    })
  }
  return
}

module.exports = monitor