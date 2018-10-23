var connection = require('ssb-client')
var pull = require('pull-stream')
var paraMap = require('pull-paramap')

var lastDaysPosts = require('./source/lastDaysPosts')
var getName = require('./async/getname')

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)

  console.time('lastDay')
  var onDone = function (error, results) {
    results.forEach(result => {
      console.log(result)
      console.log('----')
    })

    console.log(results.length)
    console.timeEnd('lastDay')
    server.close()
  }

  pull(
    lastDaysPosts(server),
    paraMap(getName(server), 50),
    pull.collect(onDone) // the sink, onDone is inMemory, pull.drain gives each result as it comes down the pipe use with console.log()
  )
})
