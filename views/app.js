var html = require('yo-yo')
var pull = require('pull-stream')
var paraMap = require('pull-paramap')

var lastDaysPosts = require('../source/lastDaysPosts')
var getName = require('../async/getName')
var Posts = require('./posts')

var state = {
  daysAgo: 0
}

var resultsEl = html`
  <div>Loading...</div>
`

module.exports = function App (server) {
  const app = html`
    <div className='app'>
      <h1>Days Posts</h1>
      <section>
        <button onclick=${() => changeDate(-1)}> Back </ button>
        <button onclick=${() => changeDate(+1)}> Fwd </ button>
      </section>
      ${resultsEl}
    </div>
  `

  renderDay(server, state)

  return app

  function changeDate (step) {
    state.daysAgo = state.daysAgo + step
    renderDay(server, state)
  }
}

function renderDay (server, state) {
  html.update(resultsEl, html`<div>Loading... </div>`)
  
  pull(
    lastDaysPosts(server, state.daysAgo),
    paraMap(getName(server), 50),
    paraMap(getBacklinks(server), 50),
    pull.collect((error, results) => {
      if (error) console.log(error)

      html.update(resultsEl, Posts(results))
    })
  )
}
