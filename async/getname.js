var pull = require('pull-stream')

// closure
module.exports = function getName (server) {
  return function (data, donecb) {
    //ssb.query author all about messages that author has published about themselves
    //find me the last about msg this user has declared about themselves which has a name attr in it
    //server, opts, pull
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
      server.query.read(opts), //source
      pull.collect(function(error, results) { 
        if (error) return donecb(error)

        var name = !results.length
          ? data.authorName = data.author
          : data.authorName = results[0].value.content.name

        donecb(null, data)
      })
    )
  }
}

// { author: '@JSrjjJja0t6v2Lb8wQN3TPecpPMrdcOcOISsDe68dpA=.ed25519',
//   text: 'Hi [@Gerry](@zFAMhcryAmD5M/HuTH7GJ/KdZguEnD654upI9LKROLw=.ed25519)! Welcome :wave: ',
//   timestamp: 1540118074552 }
// 
// {
//   "key": "DRAFT",
//   "value": {
//     "author": "@NeB4q4Hy9IiMxs5L08oevEhivxW+/aDu/s/0SkNayi0=.ed25519",
//     "previous": null,
//     "sequence": null,
//     "timestamp": 1540205654009,
//     "content": {
//       "type": "about",
//       "about": "@NeB4q4Hy9IiMxs5L08oevEhivxW+/aDu/s/0SkNayi0=.ed25519",
//       "name": "DanHassan"
//     }
//   }
// }
// 
// {
//     reverse: true,
//     query: [
//       {
//         $filter: {
//           value: {
//             timestamp: {
//               $gte: Number(now) - 24*HOUR,
//               $lt: Number(now)
//             },
//             content: {
//               type: 'post'
//             }
//           }
//         }
//       }, {
//         //defining new object which has keys, value is from the filter (not actually though it's the Msg.object which we got, we're plucking the things we want from that object)
//         $map: {
//           author: ['value', 'author'],
//           text: ['value', 'content', 'text'],
//           timestamp: ['value', 'timestamp'],
//           // key: ['key'],
//           // value: ['value']
//         }
//       }
//     ]
//   }
