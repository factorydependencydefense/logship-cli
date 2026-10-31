const assert = require('node:assert/strict');
const test = require('node:test');
const { groupByService, parseLine, servicesSeen, worstFirst } = require('../src/logs.js');
const { run } = require('../bin/logship.js');

const lines = ['orders info started', 'billing error card declined', 'orders warn slow query'];

test('parseLine splits service, level and the rest of the message', () => {
  assert.deepEqual(parseLine('orders info started up'), {
    service: 'orders',
    level: 'info',
    message: 'started up',
  });
  assert.deepEqual(parseLine('orders info'), { service: 'orders', level: 'info', message: '' });
});

test('groupByService buckets every parsed entry under its service', () => {
  assert.deepEqual(groupByService(lines), {
    orders: [
      { service: 'orders', level: 'info', message: 'started' },
      { service: 'orders', level: 'warn', message: 'slow query' },
    ],
    billing: [{ service: 'billing', level: 'error', message: 'card declined' }],
  });
});

test('servicesSeen de-duplicates in first-seen order', () => {
  assert.deepEqual(servicesSeen(lines), ['orders', 'billing']);
  assert.deepEqual(servicesSeen([]), []);
});

test('worstFirst ranks error above warn above info and unknown last', () => {
  assert.deepEqual(worstFirst([...lines, 'orders trace x']).map((entry) => entry.level), [
    'error',
    'warn',
    'info',
    'trace',
  ]);
});

test('run rejects a missing or unknown command', () => {
  const written = [];
  assert.equal(run(['explode', 'file.log'], (message) => written.push(message)), 1);
  assert.equal(run([], (message) => written.push(message)), 1);
  assert.deepEqual(written, ['unknown command: explode', 'usage: logship <group|services|worst> <file>']);
});
