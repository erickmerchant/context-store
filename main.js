'use strict'

const trim = require('lodash.trim')
const PARAM = Symbol()
const END = Symbol()
const DEFAULT = Symbol()

module.exports = function (routes) {
  const map = new Map()

  routes(add)

  return match

  function add (route, component) {
    if (!component) {
      map.set(DEFAULT, route)
    } else {
      let arr = trim(route, '/').split('/')
      let current = map

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
          next.component = component
          next.route = route

          current.set(END, true)
        }
      })
    }
  }

  function match (args) {
    var href = args.context.href || ''
    var arr = trim(href, '/').split('/')
    var current = map
    var component = null
    var route = null
    var result = null
    var params = {}

    arr.push(END)

    arr.forEach(function (key, index) {
      var next

      if (key === END) {
        if (!current.has(END)) {
          component = null
          route = null
        }
      } else if (current.has(key)) {
        next = current.get(key)

        component = next.component
        route = next.route

        current = next.map
      } else if (current.has(PARAM)) {
        next = current.get(PARAM)

        component = next.component
        route = next.route

        params[next.param] = key

        current = next.map
      } else {
        component = null
        route = null

        current = new Map()
      }
    })

    args.context.params = params
    args.context.route = route

    if (component != null) {
      result = component(args)
    }

    if (result == null && map.has(DEFAULT)) {
      component = map.get(DEFAULT)

      result = component(args)
    }

    return result
  }
}
