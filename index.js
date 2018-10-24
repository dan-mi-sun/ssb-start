var connection = require('ssb-client')
var pull = require('pull-stream')
var paraMap = require('pull-paramap')
var html = require('yo-yo')

var lastDaysPosts = require('./source/lastDaysPosts')
var getName = require('./async/getname')

// make an app layout which has:
//   - navigation
//   - results
//
// make the results dependent on a state variable
//
// when page initially loads get it to run first time
//
// add onclick in navigation which gets it run update


var state = {
  daysAgo: 0
}

var resultsEl = html`
  <div>Loading...</div>
`

function App (server) {
  return html`
    <div className='app'>
      <h1>Days Posts</h1>
      <section>
        <button onclick=${() => changeDate(-1)}> Back </ button>
        <button onclick=${() => changeDate(+1)}> Fwd </ button>
      </section>
      ${resultsEl}
    </div>
  `

  function changeDate (step) {
    state.daysAgo = state.daysAgo + step
    renderDay(server, state)
  }
}


connection(function (error, server) {
  if (error) console.log(`This is the error: ${error}`)

  document.body.appendChild(App(server))

  renderDay(server, state)
})

function renderDay (server, state) {
  html.update(resultsEl, html`<div>Loading... </div>`)
  
  pull(
    lastDaysPosts(server, state.daysAgo),
    paraMap(getName(server), 50),
    pull.collect((error, results) => {
      if (error) console.log(error)

      html.update(resultsEl, Posts(results))
    })
  )
}

function Posts (results) {
  return html`
    <div className='app'>
      ${results.map(Post)}
    </div>
  `
}

function Post (postData) {
//could do some logic and error handelling here. pospi doesn't have an author name e.g. so we could give a default
  return html`
  <div>
    <strong>${postData.authorName}</strong>
    <p>${postData.text}</p>
  </div>
  `
} 
