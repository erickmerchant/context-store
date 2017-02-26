const test = require('tape')

test('routes should match', function (t) {
  t.plan(2)

  let router = require('./main')(['test'])

  let context = router(null, '/test/')

  t.equals(context.route, 'test')

  t.deepEquals(context.params, {})
})

test('routes should match the right thing', function (t) {
  t.plan(4)

  let router = require('./main')(['test/:id', 'test/abc'])

  let context1 = router(null, '/test/123/')

  t.equals(context1.route, 'test/:id')

  t.deepEquals(context1.params, {id: '123'})

  let context2 = router(null, '/test/abc/')

  t.equals(context2.route, 'test/abc')

  t.deepEquals(context2.params, {})
})

test('sometimes the default should match', function (t) {
  t.plan(4)

  let router = require('./main')(['test/abc/def'])

  let context1 = router(null, '/test/abc/')

  t.equals(context1.route, null)

  t.deepEquals(context1.params, {})

  let context2 = router(null, '/test/abc/def/ghi/')

  t.equals(context2.route, null)

  t.deepEquals(context2.params, {})
})
