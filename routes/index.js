var express = require('express');
var router = express.Router();
var services = require('../monitoring/listServices');
const { getLatestResult } = require('../monitoring/resultDB');
var resultDB = require('../monitoring/resultDB')

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    /* get latest statuses */
    let list = await Promise.all(services.map(service => {
      getLatestResult(service.position, result => {
        service.status = result
        return service
      })
    }))
    let time = new Date()
    res.render('index', { title: 'Lapp Dashboard', services, time });
  } catch (err) {
    console.error(err)
  }
});

router.post('/', function(req, res, next) {
  res.redirect('/')
})

module.exports = router;
