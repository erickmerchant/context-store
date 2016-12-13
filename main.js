'use strict'

const catchLinks = require('catch-links')
const singlePage = require('single-page')
const url = require('url')
const PARAM = Symbol()
const END = Symbol()
const DEFAULT = Symbol()

module.exports = function (routes) {
  const map = new Map()
  let started = false
  let href
  let show

  routes(add)

  return function ({state, dispatch, next}) {
    if (!started) {
      next(function ({target, dispatch}) {
        show = singlePage(function (newHref) {
          href = newHref

          dispatch()
        })

        catchLinks(target, show)
      })

      started = true

      return
    }

    return match({state, dispatch, next})
  }

  function add (route, component) {
    if (!component) {
      map.set(DEFAULT, route)
    } else {
      const arr = segments(route)
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

  function match ({state, dispatch, next}) {
    const pathname = url.parse(href || '').pathname || ''
    const arr = segments(pathname)
    const params = {}
    let current = map
    let component = null
    let route = null
    let result = null

    arr.push(END)

    arr.forEach(function (key, index) {
      let next

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

    const context = {href, params, route}

    if (component != null) {
      result = component({state, dispatch, next, context, show})
    }

    if (result == null && map.has(DEFAULT)) {
      component = map.get(DEFAULT)

      result = component({state, dispatch, next, context, show})
    }

    return result
  }
}

function segments (str = '') {
  if (str.startsWith('/')) {
    str = str.substring(1)
  }

  if (str.endsWith('/')) {
    str = str.substring(0, str.length - 1)
  }

  return str.split('/')
}
