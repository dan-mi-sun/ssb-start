// var pull = require('pull-stream')
//
// module.exports = function getBacklinks (server) {
//   return function (data, donecb) {
//     var opts = {
//       reverse: true,
//       limit: 1,
//       query: [
//         {
//           $filter: {
//             value: {
//               author: data.author,
//               content: {
//                 type: 'about',
//                 about: data.author,
//                 name: { $is: 'string' }
//               }
//             }
//           }
//         }
//       ]
//     }
//
//     donecb(null, data)
//   }
// }
//
