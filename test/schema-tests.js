var assert = require('assert')
var EJSON = require('../lib/EJSON')

/*******************************************************************************
 * schema tests
 */

// Test EJSON expansion
var schema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'ObjectId' },
    c: { type: 'Date' },
    d: { type: 'Timestamp' },
    e: { type: 'Regex' },
    f: { type: 'Undefined' },
    g: { type: 'MinKey' },
    h: { type: 'MaxKey' },
    i: { type: 'Long' },
    j: { type: 'DBRef' },
    k: { type: 'Array', items: { type: 'Date' }}
  }
}

var expandedSchema = {
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { 
      type: 'object',
      required: ['$oid'],
      properties: {
        '$oid' : { type: 'string' }
      },
      additionalProperties: false
    },
    c: { 
      type: 'object',
      required: ['$date'],
      properties: {
        '$date' : { type: 'string' }
      },
      additionalProperties: false
    },
    d: { 
      type: 'object',
      required: ['$timestamp'],
      properties: {
        '$timestamp' : { 
          type: 'object',
          properties: {
            t: { type: 'number' },
            i: { type: 'number' }
          },
          additionalProperties: false
        }
      },
      additionalProperties: false
    },
    e: { 
      type: 'object',
      required: ['$regex'],
      properties: {
        '$regex' : { type: 'string' },
        '$options': { type: 'string' }
      },
      additionalProperties: false
    },
    f: { 
      type: 'object',
      required: ['$undefined'],
      properties: {
        '$undefined': { type: 'boolean' }
      },
      additionalProperties: false
    },
    g: { 
      type: 'object',
      required: ['$minKey'],
      properties: {
        '$minKey': { type: 'number', minimum: 1, maximum: 1 }
      },
      additionalProperties: false
    },
    h: { 
      type: 'object',
      required: ['$maxKey'],
      properties: {
        '$maxKey': { type: 'number', minimum: 1, maximum: 1 }
      },
      additionalProperties: false
    },
    i: { 
      type: 'object',
      required: ['$numberLong'],
      properties: {
        '$numberLong': { type: 'string' }
      },
      additionalProperties: false
    },
    j: { 
      type: 'object',
      required: ['$ref'],
      properties: {
        '$ref': { type: 'string' },
        '$id': {} 
      },
      additionalProperties: false
    },
    k: { 
      type: 'Array', 
      items:  { 
        type: 'object',
        required: ['$date'],
        properties: {
          '$date' : { type: 'string' }
        },
        additionalProperties: false
      },
    }
  }
}

//console.log(schema)
//console.log(jsonSchemaValidator.toJSONSchema(schema))
//console.log(expandedSchema)

assert.deepEqual(EJSON.toJSONSchema(schema), expandedSchema)
