const trim = require('lodash.trim')
const PARAM = Symbol()
const END = Symbol()

module.exports = function (routes) {
  var map = new Map()

  ;(routes || []).forEach(function (route) {
    add(route)
  })

  return {
    add: add,
    match: match
  }

  function add (route) {
    var arr = trim(route, '/').split('/')
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
        next.route = route

        current.set(END, true)
      }
    })
  }

  function match (path) {
    var arr = trim(path, '/').split('/')
    var current = map
    var context = {
      params: {},
      route: ''
    }

    arr.push(END)

    arr.forEach(function (key, index) {
      var next

      if (key === END) {
        if (!current.has(END)) {
          context.route = null
        }
      } else if (current.has(key)) {
        next = current.get(key)

        context.route = next.route

        current = next.map
      } else if (current.has(PARAM)) {
        next = current.get(PARAM)

        context.route = next.route

        context.params[next.param] = key

        current = next.map
      } else {
        context.route = null

        current = new Map()
      }
    })

    if (context.route != null) {
      return context
    }

    return null
  }
}
