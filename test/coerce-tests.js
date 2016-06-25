var _ = require('lodash')
var assert = require('assert')
var EJSON = require('../lib/EJSON')

/******************************************************************************
 * coerce-tests
 */
var tests = [
  { 
    value: 0,
    schema: undefined,
    result: 0
  },

  { 
    value: 0,
    schema: { type: 'string' }, // We do not currently coerce into strings from other types but we could
    result: 0
  },

  { 
    value: "true",
    schema: { type: 'boolean' },
    result: true
  },

  { 
    value: "-1",
    schema: { type: 'number' },
    result: -1
  },

  { 
    value: -1,
    schema: { type: 'number' },
    result: -1
  },

  { 
    value: { a: "true", b: "2" },
    schema: { 
      type: 'object',
      properties: {
        a: { type: 'boolean' },
        b: { type: 'number' },
      }
    },
    result: { a: true, b: 2 },
  },

  { 
    value: ["true", "false"],
    schema: { 
      type: 'array',
      items: { type: 'boolean' },
    },
    result: [true, false]
  },

  { 
    value: [{ a: "true", b: "2" }],
    schema: { 
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: { type: 'boolean' },
          b: { type: 'number' },
        }
      }
    },
    result: [{ a: true, b: 2 }],
  },
]

_.forEach(tests, function(test) {
  assert.deepEqual(EJSON.coerce(test.value, test.schema), test.result, JSON.stringify(test))
})
