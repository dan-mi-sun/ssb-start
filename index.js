var connection = require('ssb-client')
var pull = require('pull-stream')

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)
  var opts = {
    reverse: true,
    query: [
      {
        $filter: {
          value: {
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
    server.close()
  }
  pull(
    server.query.read(opts), // the source
    pull.take(10), // this is another through
    pull.collect(onDone) // the sink, onDone is inMemory, pull.drain gives each result as it comes down the pipe use with console.log()
  )
})
