var connection = require('ssb-client')
var pull = require('pull-stream')
var paraMap = require('pull-paramap')
var html = require('yo-yo')

var lastDaysPosts = require('./source/lastDaysPosts')
var getName = require('./async/getname')

var app = html`
<h1>Loading</h1>
`
document.body.appendChild(app)

function render () {
  html.update(app, newView)
}

connection(function (error, server) {
  // anon fn cb within connection
  if (error) console.log(`This is the error: ${error}`)

  console.time('lastDay')
  var onDone = function (error, results) {
    // results.forEach(result => {
      // console.log(result)
      // console.log('----')
    // })

    var newView = html`
    <div className='app'>
      ${results.map(Post)}
    </div>
    `
    html.update(app, newView)

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

function Post (postData) {
//could do some logic and error handelling here. pospi doesn't have an author name e.g. so we could give a default
  return html`
  <div>
    <strong>${postData.authorName}</strong>
    <p>${postData.text}</p>
  </div>
  `
} 
