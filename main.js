const trim = require('lodash.trim')
const PARAM = Symbol()

module.exports = function () {
  var map = new Map()
  var currentSymbol

  return {
    add: add,
    match: match
  }

  function add (path, callback) {
    var arr = trim(path, '/').split('/')
    var current = map

    arr.forEach(function (key, index) {
      var next
      var param

      if (key.startsWith(':')) {
        param = key.substr(1)
        key = PARAM
      }

      if (current.has(key)) {
        next = current.get(key)
      } else {
        next = {
          map: new Map()
        }
      }

      if (param) {
        next.param = param
      }

      current.set(key, next)

      current = next.map

      if (index + 1 === arr.length) {
        next.callback = callback
      }
    })
  }

  function match (path, data) {
    var arr = trim(path, '/').split('/')
    var current = map
    var params = {}
    var callback
    var result = true
    var symbol = Symbol()

    arr.forEach(function (key, index) {
      var next

      if (current.has(key)) {
        next = current.get(key)

        callback = next.callback

        current = next.map
      } else if (current.has(PARAM)) {
        next = current.get(PARAM)

        callback = next.callback

        params[next.param] = key

        current = next.map
      } else {
        result = false
      }

      if (result !== false && index + 1 === arr.length) {
        currentSymbol = symbol

        callback(params, done)
      }

      function done (done) {
        if (symbol === currentSymbol) {
          if (typeof done === 'function') {
            done()
          }
        }
      }
    })

    return result
  }
}
