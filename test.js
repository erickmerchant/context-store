var tap = require('tap')

tap.test('routes should match', function (t) {
  var router = require('./main')(['test'])
  var context

  t.plan(1)

  context = router.match('test')

  t.equals('test', context.route)
})

tap.test('routes should match the right thing', function (t) {
  var router = require('./main')()
  var context

  t.plan(2)

  router.add('test/:id')

  router.add('test/abc')

  context = router.match('test/123')

  t.equals(context.route, 'test/:id')

  t.equals(context.params.id, '123')
})

tap.test('sometimes nothing should match', function (t) {
  var router = require('./main')()
  var context

  t.plan(2)

  router.add('test/abc/123')

  context = router.match('test/xyz')

  t.looseEquals(context, null)

  context = router.match('test/abc')

  t.looseEquals(context, null)
})
