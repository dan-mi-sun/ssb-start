var connection = require('ssb-client')

var App = require('./views/app')

connection(function (error, server) {
  if (error) console.log(`This is the error: ${error}`)

  var app = App(server)
  document.body.appendChild(app)
})
