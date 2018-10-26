var pull = require('pull-stream')

module.exports = function getName (server) {
  return function (data, donecb) {
    var opts = {
      reverse: true,
      limit: 1,
      query: [
        {
          $filter: {
            value: {
              author: data.author,
              content: {
                type: 'about',
                about: data.author,
                name: { $is: 'string' }
              }
            }
          }
        }
      ]
    }

    pull(
      server.query.read(opts), // source
      pull.collect(function (error, results) {
        if (error) return donecb(error)

        var name = !results.length
          ? data.authorName = data.author
          : data.authorName = results[0].value.content.name

        donecb(null, data)
      })
    )
  }
}
