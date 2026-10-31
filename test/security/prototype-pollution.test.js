const assert = require('node:assert/strict');
const test = require('node:test');
const { groupByService, servicesSeen, worstFirst } = require('../../src/logs.js');

test('a __proto__ service name must not reach Object.prototype', () => {
  try {
    groupByService(['__proto__ error logSecGroupBy']);
    assert.equal({}.level, undefined);
    assert.equal({}.message, undefined);
  } finally {
    delete Object.prototype.level;
    delete Object.prototype.message;
  }
});

test('a constructor service name must not reach Object.prototype', () => {
  try {
    groupByService(['constructor error logSecCtor']);
    assert.equal({}.logSecCtor, undefined);
  } finally {
    delete Object.prototype.logSecCtor;
  }
});

test('servicesSeen must not let a __proto__ service name reach Object.prototype', () => {
  try {
    servicesSeen(['__proto__ info a', '__proto__ warn b']);
    assert.equal({}.service, undefined);
  } finally {
    delete Object.prototype.service;
  }
});

test('worstFirst must not let a __proto__ service name reach Object.prototype', () => {
  try {
    worstFirst(['__proto__ error a', 'orders info b']);
    assert.equal({}.service, undefined);
  } finally {
    delete Object.prototype.service;
  }
});
