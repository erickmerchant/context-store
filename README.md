# @erickmerchant/context-store

Creates a store to be used with [combine-stores](https://www.npmjs.com/package/@erickmerchant/combine-stores).

``` javascript
const framework = require('@erickmerchant/framework')

const combineStores = require('@erickmerchant/combine-stores')

const contextStore = require('@erickmerchant/context-store')

const store = combineStores(function (store) {
  store('context', contextStore(['', 'create', 'edit/:id']))
})

const component = require('./components/index')

const target = document.querySelector('main')

const diff = require('yo-yo').update

framework({target, store, component, diff})(init)

function init ({dispatch}) {
  const history = require('./history')

  history.listen(function (location) {
    dispatch('context', location.pathname)
  })

  dispatch('context', history.location.pathname)
}
```
