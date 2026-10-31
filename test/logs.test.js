const assert = require('node:assert/strict');
const test = require('node:test');
const { groupByService, parseLine, servicesSeen, worstFirst } = require('../src/logs.js');
const { run } = require('../bin/logship.js');

const lines = [
  'orders info started',
  'billing error card declined',
  'orders warn slow query',
];

test('parseLine splits service, level and message', () => {
  assert.deepEqual(parseLine('orders info started up'), {
    service: 'orders',
    level: 'info',
    message: 'started up',
  });
});

test('groupByService buckets entries per service', () => {
  const grouped = groupByService(lines);
  assert.deepEqual(Object.keys(grouped).sort(), ['billing', 'orders']);
  assert.equal(grouped.orders.length, 2);
});

test('servicesSeen de-duplicates', () => {
  assert.deepEqual(servicesSeen(lines), ['orders', 'billing']);
});

test('worstFirst sorts errors ahead of info', () => {
  assert.deepEqual(worstFirst(lines).map((e) => e.level), ['error', 'warn', 'info']);
});

test('the CLI rejects an unknown command', () => {
  const written = [];
  assert.equal(run(['explode', 'file.log'], (m) => written.push(m)), 1);
  assert.match(written[0], /unknown command/);
});
