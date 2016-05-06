var tap = require('tap')

tap.test('', function (t) {
  var router = require('./main')()

  t.plan(1)

  router.add('test', function (params, done) {
    t.ok(true)

    t.end()
  })

  router.match('test')
})

tap.test('', function (t) {
  var router = require('./main')()

  t.plan(1)

  router.add('test/:id', function (params, done) {
    t.equals(params.id, '123')

    t.end()
  })

  router.match('test/123')
})

tap.test('', function (t) {
  var router = require('./main')()

  t.plan(1)

  router.add('test/123', function (params, done) {
    t.ok(true)

    t.end()
  })

  router.add('test/:id', function (params, done) {
    t.ok(false)
  })

  router.match('test/123')
})

tap.test('', function (t) {
  var router = require('./main')()

  t.plan(0)

  router.add('test/abc', function (params, done) {
  })

  router.match('test/123')
})

tap.test('', function (t) {
  var router = require('./main')()

  t.plan(1)

  router.add('test/abc', function (params, done) {
    process.nextTick(function () {
      done(function () {
        t.ok(false)

        t.end()
      })
    })
  })

  router.add('test/123', function (params, done) {
    process.nextTick(function () {
      done(function () {
        t.ok(true)

        t.end()
      })
    })
  })

  router.match('test/abc')

  router.match('test/123')
})
