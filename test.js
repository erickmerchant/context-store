var test = require('tape')

test('routes should match', function (t) {
  t.plan(1)

  var router = require('./main')(function (route) {
    route('test', function () {
      t.ok(true)

      return ''
    })
  })

  router({href: 'test'})
})

test('routes should match the right thing', function (t) {
  t.plan(2)

  var router = require('./main')(function (route) {
    route('test/:id', function (args) {
      t.equals(args.params.id, '123')

      return ''
    })

    route('test/abc', function (args) {
      t.ok(true)

      return ''
    })
  })

  router({href: 'test/123'})

  router({href: 'test/abc'})
})

test('sometimes the default should match', function (t) {
  var router = require('./main')(function (route) {
    route('test/abc/def', function () {
      t.ok(false)

      return ''
    })

    route(function () {
      t.ok(true)

      return ''
    })
  })

  t.plan(2)

  router({href: 'test/abc'})

  router({href: 'test/abc/def/ghi'})
})
