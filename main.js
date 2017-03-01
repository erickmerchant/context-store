'use strict'

const PARAM = Symbol('PARAM')
const END = Symbol('END')

module.exports = function (routes) {
  const map = new Map()

  routes.forEach(function (route) {
    route = trimSlashes(route)

    const arr = route.split('/')
    let current = map

    arr.forEach(function (key, index) {
      let next
      let param

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

        if (param) {
          next.param = param
        }
      }

      current.set(key, next)

      current = next.map

      if (index + 1 === arr.length) {
        next.route = route

        current.set(END, true)
      }
    })
  })

  return function (state = {params: {}, route: null}, href = '') {
    href = trimSlashes(href)
    const arr = href.split('/')
    const params = {}
    let current = map
    let route = null

    arr.push(END)

    arr.forEach(function (key, index) {
      let next

      if (key === END) {
        if (!current.has(END)) {
          route = null
        }
      } else if (current.has(key)) {
        next = current.get(key)

        route = next.route

        current = next.map
      } else if (current.has(PARAM)) {
        next = current.get(PARAM)

        route = next.route

        params[next.param] = key

        current = next.map
      } else {
        route = null

        current = new Map()
      }
    })

    state = {params, route}

    return state
  }
}

function trimSlashes (str = '') {
  if (str.startsWith('/')) {
    str = str.substring(1)
  }

  if (str.endsWith('/')) {
    str = str.substring(0, str.length - 1)
  }

  return str
}
