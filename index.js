var connection = require('ssb-client')
var pull = require('pull-stream')

var HOUR = 3600000

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)

  var now = new Date()
  var opts = {
    reverse: true,
    query: [
      {
        $filter: {
          value: {
            timestamp: {
              $gte: Number(now) - 24*HOUR,
              $lt: Number(now)
            },
            content: {
              type: 'post'
            }
          }
        }
      }
    ]
  }

  var onDone = function (error, results) {
    results.forEach(msg => {
      console.log(msg.value.content)
      console.log('----')
    })

    console.log(results.length)
    server.close()
  }
  pull(
    server.query.read(opts), // the source
    pull.collect(onDone) // the sink, onDone is inMemory, pull.drain gives each result as it comes down the pipe use with console.log()
  )
})
