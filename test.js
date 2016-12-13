const test = require('tape')
const mockery = require('mockery')
const app = {
  next: function (callback) {
    callback({
      dispatch: function () {}
    })
  },
  dispatch: function () {}
}

test('routes should match', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(4)

  let singlePage

  mockery.registerMock('single-page', function (callback) {
    t.ok(true)

    singlePage = callback
  })

  mockery.registerMock('catch-links', function (target, callback) {
    t.ok(true)
  })

  let router = require('./main')(function (route) {
    route('test', function ({context}) {
      t.ok(context.route, 'test')
      t.ok(context.href, '/test/?aaa#bbb')

      return ''
    })
  })

  router(app)

  singlePage('/test/?aaa#bbb')

  router(app)

  mockery.disable()
})

test('routes should match the right thing', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(7)

  let singlePage

  mockery.registerMock('single-page', function (callback) {
    t.ok(true)

    singlePage = callback
  })

  mockery.registerMock('catch-links', function (target, callback) {
    t.ok(true)
  })

  let router = require('./main')(function (route) {
    route('test/:id', function ({context}) {
      t.equals(context.params.id, '123')
      t.equals(context.route, 'test/:id')
      t.equals(context.href, '/test/123/?aaa#bbb')

      return ''
    })

    route('test/abc', function ({context}) {
      t.equals(context.route, 'test/abc')
      t.equals(context.href, '/test/abc/?aaa#bbb')

      return ''
    })
  })

  router(app)

  singlePage('/test/123/?aaa#bbb')

  router(app)

  singlePage('/test/abc/?aaa#bbb')

  router(app)

  mockery.disable()
})

test('sometimes the default should match', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(4)

  let singlePage

  mockery.registerMock('single-page', function (callback) {
    t.ok(true)

    singlePage = callback
  })

  mockery.registerMock('catch-links', function (target, callback) {
    t.ok(true)
  })

  let router = require('./main')(function (route) {
    route('test/abc/def', function () {
      t.ok(false)

      return ''
    })

    route(function ({context}) {
      t.equals(context.route, null)

      return ''
    })
  })

  router(app)

  singlePage('/test/abc/')

  router(app)

  singlePage('/test/abc/def/ghi/')

  router(app)

  mockery.disable()
})
