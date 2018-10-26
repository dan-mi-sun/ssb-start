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
        $map: {
          author: ['value', 'author'],
          text: ['value', 'content', 'text'],
          timestamp: ['value', 'timestamp']
        }
      }
    ]
  }
  return server.query.read(opts)
}
