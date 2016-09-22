var test = require('tape')

test('routes should match', function (t) {
  t.plan(2)

  var router = require('./main')(function (route) {
    route('test', function (ctx) {
      return function () {
        t.ok(ctx.route, 'test')
        t.ok(ctx.href, 'test?aaa#bbb')

        return ''
      }
    })
  })

  router('test?aaa#bbb')()
})

test('routes should match the right thing', function (t) {
  t.plan(5)

  var router = require('./main')(function (route) {
    route('test/:id', function (ctx) {
      return function () {
        t.equals(ctx.params.id, '123')
        t.equals(ctx.route, 'test/:id')
        t.equals(ctx.href, 'test/123?aaa#bbb')

        return ''
      }
    })

    route('test/abc', function (ctx) {
      return function () {
        t.equals(ctx.route, 'test/abc')
        t.equals(ctx.href, 'test/abc?aaa#bbb')

        return ''
      }
    })
  })

  router('test/123?aaa#bbb')()

  router('test/abc?aaa#bbb')()
})

test('sometimes the default should match', function (t) {
  t.plan(2)

  var router = require('./main')(function (route) {
    route('test/abc/def', function (ctx) {
      return function () {
        t.ok(false)

        return ''
      }
    })

    route(function (ctx) {
      return function () {
        t.equals(ctx.route, null)

        return ''
      }
    })
  })

  router('test/abc')()

  router('test/abc/def/ghi')()
})
