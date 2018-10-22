var connection = require('ssb-client')
var pull = require('pull-stream')

var lastDaysPosts = require('./source/lastDaysPosts')

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)

  var onDone = function (error, results) {
    results.forEach(result => {
      console.log(result)
      console.log('----')
    })

    console.log(results.length)
    server.close()
  }
  pull(
    lastDaysPosts(server),
    pull.collect(onDone) // the sink, onDone is inMemory, pull.drain gives each result as it comes down the pipe use with console.log()
  )
})
