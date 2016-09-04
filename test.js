var test = require('tape')

test('routes should match', function (t) {
  t.plan(2)

  var router = require('./main')(function (route) {
    route('test', function (args) {
      t.ok(args.context.route, 'test')
      t.ok(args.context.href, 'test')

      return ''
    })
  })

  router({ context: { href: 'test' } })
})

test('routes should match the right thing', function (t) {
  t.plan(5)

  var router = require('./main')(function (route) {
    route('test/:id', function (args) {
      t.equals(args.context.params.id, '123')
      t.equals(args.context.route, 'test/:id')
      t.equals(args.context.href, 'test/123')

      return ''
    })

    route('test/abc', function (args) {
      t.equals(args.context.route, 'test/abc')
      t.equals(args.context.href, 'test/abc')

      return ''
    })
  })

  router({ context: { href: 'test/123' } })

  router({ context: { href: 'test/abc' } })
})

test('sometimes the default should match', function (t) {
  t.plan(2)

  var router = require('./main')(function (route) {
    route('test/abc/def', function (args) {
      t.ok(false)

      return ''
    })

    route(function (args) {
      t.equals(args.context.route, null)

      return ''
    })
  })

  router({ context: { href: 'test/abc' } })

  router({ context: { href: 'test/abc/def/ghi' } })
})
