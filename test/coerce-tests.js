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
    schema: null,
    result: 0
  },

  { 
    value: 0,
    schema: { type: 'string' }, // We do not currently coerce into strings from other types but we could
    result: 0
  },

  { 
    value: "hello",
    schema: { type: 'string' }, 
    result: "hello"
  },

  { 
    value: '"hello"',
    schema: { type: 'string' }, 
    result: '"hello"'
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
    value: "576ef07f65cb0809ef59e0b7",
    schema: { type: "ObjectId" },
    result: new EJSON.ObjectId("576ef07f65cb0809ef59e0b7"),
  },

  { 
    value: "Sat Jun 25 2016 15:18:15 GMT-0700 (PDT)",
    schema: { type: "Date" },
    result: new Date("Sat Jun 25 2016 15:18:15 GMT-0700 (PDT)")
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

  { 
    value: { a: ["true", "false"] },
    schema: { 
      type: 'object',
      properties: {
        a: { 
          type: 'array',
          items: { type: 'boolean' }
        }
      }
    },
    result: { a: [true, false] }
  },

  { 
    value: { 
      x: new EJSON.ObjectId("576ef07f65cb0809ef59e0b7"),
      y: new Date("Sat Jun 25 2016 15:18:15 GMT-0700 (PDT)"),
      z: [ 9, true ]      
    },
    schema: { 
      type: 'object',
      properties: {
        x: { type: 'ObjectId' },
        y: { type: 'Date' },
        z: { type: 'array' },
      }
    },
    result: { 
      x: new EJSON.ObjectId("576ef07f65cb0809ef59e0b7"),
      y: new Date("Sat Jun 25 2016 15:18:15 GMT-0700 (PDT)"),
      z: [ 9, true ]      
    }
  },

]

_.forEach(tests, function(test) {
  assert.deepEqual(EJSON.coerce(test.value, test.schema), test.result, JSON.stringify(test))
})
