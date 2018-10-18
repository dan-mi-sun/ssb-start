var connection = require('ssb-client')
var pull = require('pull-stream')

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)
  var opts = { limit: 100, reverse: true }

  var onDone = function (error, results) {
    results.forEach(msg => {
      console.log(msg.value.content)
      console.log('----')
    })
    server.close()
  }
  pull(
    server.query.read(opts), // the source
    pull.filter(msg => msg.value.content.type === 'post'), // filter 'through' other throughs pull.map, also asyncMap & paraMap
    pull.collect(onDone) // the sink, onDone is inMemory, pull.drain gives each result as it comes down the pipe use with console.log()
  )
})
