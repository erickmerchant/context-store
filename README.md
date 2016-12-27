# @erickmerchant/router

Meant to be used with [@erickmerchant/framework](https://github.com/erickmerchant/framework), it is a component that will route history changes to the correct component and add `context` and `show` properties to the object passed to it. Internally it uses [single-page](https://github.com/substack/single-page) and [catch-links](https://github.com/substack/catch-links).

``` javascript
/* an example */

const framework = require('@erickmerchant/framework')

const store = require('./store.js')

/* here is the relevant stuff */

const router = require('@erickmerchant/router')

const component = router(function (route) {
  route('', require('./components/index'))
  route('create', require('./components/create'))
  route('edit/:id', require('./components/edit'))
  route(require('./components/unfound'))
})

/* end relevant */

const target = document.querySelector('main')

const yo = require('yo-yo')
const diff = yo.update

framework({target, store, component, diff})
```

## API Reference

### Framework Code

#### router

_router(callback)_

The function exported by this module.

- callback: see [router callback](#router-callback)

#### route

_route(route, component)_

If the first parameter is omitted the component will be treated as the default and will match any href that doesn't match another route. The component will be called with all the usual framework arguments, but also [context](#context) and [show](#show).

- route: optional. The route
- component: [a component](https://github.com/erickmerchant/framework#component)

#### context

An object with the following properties

- href: the full href that was passed to single-page
- params: any params that are captured
- route: the route that was matched

For example if the href is `test/123` and the route matched is `test/:id` then the context would be `{ href: 'test/123', params: {id: 123}, route: 'test/:id' }`

#### show

Show is the function returned by single-page. Pass it a href to redirect to that page.

### Application Code

#### router callback

_callback(route)_

- route: see [route](#route)
