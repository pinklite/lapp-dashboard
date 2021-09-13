const axios = require('axios')
const { forEach } = require('../monitoring/listServices')
require('dotenv').config()

const update = (name, status, position) => {
  if (!process.env.USE_BCMINI === 'true') return
  axios.get(`http://${process.env.BCMINI_LOCAL_IP}/api/ou_text/${position.toString()}/${name}/${status}`)
    .then(response => { return })
    .catch(err => { console.error('Error updating BCMini for ', name); return })
}

const pause = () => {
  try {
    if (!process.env.USE_BCMINI === 'true') return
    console.log('Pausing automatic updates on BCMini')
    axios.get(`http://${process.env.BCMINI_LOCAL_IP}/api/action/pause`)
  } catch (err) {
    console.error('Cannot reach BlockClock Mini; check local IP and if this device is on the same LAN')
  }
}

const fillEmpty = () => {
  if (!process.env.USE_BCMINI === 'true') return
  [...Array(7).keys()].forEach(async pos => {
    try {
      await axios.get(`http://${process.env.BCMINI_LOCAL_IP}/api/image/${pos.toString()}/register`)
    } catch (err) {
      console.error(err)
    }
  })
}

const flash = () => {
  if (!process.env.USE_BCMINI === 'true') return
  try {
    await axios.get(`http://${process.env.BCMINI_LOCAL_IP}/api/lights/flash`)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { update, pause, fillEmpty, flash }