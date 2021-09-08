/* Define services to monitor in file 'listServices.json' in the same directory as this file.
 *
 * Schema is:
 * [{
 *    position: INTEGER 0-6 (0=leftmost digit, 6=rightmost digit),
 *    name: STRING 1-4 chars,
 *    type: 'WEB' or 'LND' for now,
 *    url: http/https, port optional, OR asdfasd.onion address WITHOUT http prefix
 *    macaroon: readonly macaroon in hexadecimal (ONLY necessary for LND)
 * }, ...]
 * 
 * You should ONLY use a READONLY MACAROON for LND.
 */

const fs = require('fs')
const jsonUnsorted = JSON.parse(fs.readFileSync('./monitoring/listServices.json', 'utf8'))
const json = jsonUnsorted.sort((a, b) => { return a.position - b.position })

module.exports = json