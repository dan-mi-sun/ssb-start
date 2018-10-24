var HOUR = 3600000
var DAY = 24 * HOUR

module.exports = function lastDaysPosts (server, daysAgo = 0) {
  var now = new Date()
  var opts = {
    reverse: true,
    query: [
      {
        $filter: {
          value: {
            timestamp: {
              $gte: Number(now) - DAY + daysAgo * DAY,
              $lt: Number(now) + daysAgo * DAY
            },
            content: {
              type: 'post'
            }
          }
        }
      }, {
        // defining new object which has keys, value is from the filter (not actually though it's the Msg.object which we got, we're plucking the things we want from that object)
        $map: {
          author: ['value', 'author'],
          text: ['value', 'content', 'text'],
          timestamp: ['value', 'timestamp']
          // key: ['key'],
          // value: ['value']
        }
      }
    ]
  }
  return server.query.read(opts) // the source
}
