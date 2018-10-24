var pull = require('pull-stream')

module.exports = function getBacklinks (server) {
  return function (data, donecb) {

    donecb(null, data)
  }
}

