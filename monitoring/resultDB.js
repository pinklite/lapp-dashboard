require('dotenv').config()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')
// DB stores results as position=INT(0-6), status=STRING('OK','ERR')
db.run("create table if not exists results(position, status)")

const storeNewResult = (position, status) => { 
  db.run('delete from results where position=?', position, (err) => {
    if (err) {
      console.error(err)
      return err
    }
    db.run('insert into results(position, status) values(?,?)', position, status, (err) => {
      if (err) {
        console.error(err)
        return err
      }
      return
    })
  })
}

const getLatestResult = (position, callback) => {
  db.all('select * from results where position=?', position, (err, rows) => {
    if (err) {
      console.error(err)
      return err
    }
    if (rows.length === 0) {
      return callback('1ST')
    }
    return callback(rows[0].status)
  })
}

module.exports = { storeNewResult, getLatestResult }