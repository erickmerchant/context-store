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
  var obj = {
    abc: 123
  }

  t.plan(1)

  router.add('test/123', function (params, done) {
    process.nextTick(function () {
      done(function () {
        t.ok(false)

        t.end()
      })
    })
  })

  router.add('test/abc', function (params, data, done) {
    process.nextTick(function () {
      done(function () {
        t.equals(data, obj)

        t.end()
      })
    })
  })

  router.match('test/123')

  router.match('test/abc', obj)
})

tap.test('', function (t) {
  var router = require('./main')()
  var obj = {
    abc: 123
  }

  t.plan(3)

  router.add('test/:id', function (params, data, done) {
    process.nextTick(function () {
      done('afsd')

      t.deepEquals(data, obj)

      t.deepEquals(params, {id: 'abc'})
    })
  })

  router.match('test/abc', obj)

  router.add('test/:id', function (params, done) {
    process.nextTick(function () {
      done('afsd')

      t.deepEquals(params, {id: 'abc'})
    })
  })

  router.match('test/abc')
})
