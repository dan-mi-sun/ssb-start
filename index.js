var connection = require('ssb-client')

connection(function (error, server){
  //anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)
  server.whoami(function (error, response){
    if (error) console.log('Poo:', error)
    console.log(response)
    server.close()
  })

})
