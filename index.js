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
      }, {
        //defining new object which has keys, value is from the filter (not actually though it's the Msg.object which we got, we're plucking the things we want from that object)
        $map: {
          author: ['value', 'author'],
          text: ['value', 'content', 'text'],
          timestamp: ['value', 'timestamp'],
          // key: ['key'],
          // value: ['value']
        }
      }
    ]
  }

  var onDone = function (error, results) {
    results.forEach(result => {
      console.log(result)
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
