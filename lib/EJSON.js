var ZSchema = require('z-schema')
var _ = require('lodash')
var EJSON = require('@carbon-io/mongodb-extended-json')
var mongodb = require('@carbon-io/leafnode').mongodb

/***************************************************************************************************
 * @namespace ejson
 */

/***************************************************************************************************
 * EJSON
 *
 * https://docs.mongodb.com/manual/reference/mongodb-extended-json/
 *
 * EJSON types we support:
 * - Date
 * - DBRef
 * - MaxKey
 * - MinKey
 * - Long (aka NumberLong)
 * - ObjectId
 * - Regex
 * - Timestamp
 * - Undefined
 *
 * EJSON types we do not support:
 * - Binary
 *
 * EJSON types suggested to exist via the Node.js mongodb driver but that
 * do not see like official EJSON. We do not support these:
 * - Code
 * - Decimal128
 * - Double
 * - Map
 * - Symbol
 *
 */
module.exports = {

  /*****************************************************************************
   * @property {xxx} types -- xxx
   * @memberof ejson
   */
  types: {
    Date: Date,
    DBRef: mongodb.DBRef,
    MaxKey: mongodb.MaxKey,
    MinKey: mongodb.MinKey,
    Long: mongodb.Long,
    ObjectId: mongodb.ObjectId,
    Regex: RegExp,
    Timestamp: mongodb.Timestamp
  },

  /*****************************************************************************
   * @property {xxx} ejsonSchemas -- xxx
   * @memberof ejson
   */
  ejsonSchemas: {
    Date: {
      type: 'object',
      required: ['$date'],
      properties: {
        '$date' : { type: 'string' }
      },
      additionalProperties: false
    },
    DBRef: {
      type: 'object',
      required: ['$ref'],
      properties: {
        '$ref': { type: 'string' },
        '$id': {} // XXX not sure about this -- want any type
      },
      additionalProperties: false
    },
    MaxKey: {
      type: 'object',
      required: ['$maxKey'],
      properties: {
        '$maxKey': { type: 'number', minimum: 1, maximum: 1 }
      },
      additionalProperties: false
    },
    MinKey: {
      type: 'object',
      required: ['$minKey'],
      properties: {
        '$minKey': { type: 'number', minimum: 1, maximum: 1 }
      },
      additionalProperties: false
    },
    Long: {
      type: 'object',
      required: ['$numberLong'],
      properties: {
        '$numberLong': { type: 'string' }
      },
      additionalProperties: false
    },
    ObjectId: {
      type: 'object',
      required: ['$oid'],
      properties: {
        '$oid' : { type: 'string' }
      },
      additionalProperties: false
    },
    Regex: {
      type: 'object',
      required: ['$regex'],
      properties: {
        '$regex' : { type: 'string' },
        '$options': { type: 'string' }
      },
      additionalProperties: false
    },
    Timestamp: {
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
    Undefined: {
      type: 'object',
      required: ['$undefined'],
      properties: {
        '$undefined': { type: 'boolean' }
      },
      additionalProperties: false
    },
  },

  /*****************************************************************************
   * @method isDate
   * @description isDate description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isDate: function(obj) {
    return obj instanceof Date
  },

  /*****************************************************************************
   * @method isDBRef
   * @description isDBRef description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isDBRef: function(obj) {
    return obj._bsontype === 'DBRef'
  },

  /*****************************************************************************
   * @method isMaxKey
   * @description isMaxKey description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isMaxKey: function(obj) {
    return obj._bsontype === 'MaxKey'
  },

  /*****************************************************************************
   * @method isMinKey
   * @description isMinKey description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isMinKey: function(obj) {
    return obj._bsontype === 'MinKey'
  },

  /*****************************************************************************
   * @method isLong
   * @description isLong description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isLong: function(obj) {
    return obj._bsontype === 'Long'
  },

  /*****************************************************************************
   * @method isObjectId
   * @description isObjectId description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isObjectId: function(obj) {
    return obj._bsontype === 'ObjectID' // Note ID vs Id. They now support both but just one _bsontype.
  },

  /*****************************************************************************
   * @method isRegex
   * @description isRegex description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isRegex: function(obj) {
    return obj instanceof RegExp
  },

  /*****************************************************************************
   * @method isTimestamp
   * @description isTimestamp
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isTimestamp: function(obj) {
    return obj._bsontype === 'Timestamp'
  },

  /*****************************************************************************
   * @method isUndefined
   * @description isUndefined
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @returns {xxx} -- xxx
   */
  isUndefined: function(obj) {
    return obj === undefined
  },

  /*****************************************************************************
   * @method serialize
   * @description serialize description
   * @memberof ejson
   * @param {xxx} ejson -- xxx
   * @returns {xxx} -- xxx
   */
  serialize: function(ejson) {
    return EJSON.serialize(ejson)
  },

  /*****************************************************************************
   * @method deserialize
   * @description deserialize description
   * @memberof ejson
   * @param {xxx} ejson -- xxx
   * @returns {xxx} -- xxx
   */
  deserialize: function(ejson) {
    return EJSON.deserialize(ejson)
  },

  /*****************************************************************************
   * @method parse
   * @description parse description
   * @memberof ejson
   * @param {xxx} str -- xxx
   * @returns {xxx} -- xxx
   */
  parse: function(str) {
    return EJSON.parse(str)
  },

  /*****************************************************************************
   * @method stringify
   * @description stringify
   * @memberof ejson
   * @param {xxx} str -- xxx
   * @returns {xxx} -- xxx
   */
  stringify: function(str) {
    return EJSON.stringify(str)
  },

  /*****************************************************************************
   * @method coerce
   * @description coerce description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @param {xxx} schema -- xxx
   * @returns {xxx} -- xxx
   */
  coerce: function(obj, schema) {
    var self = this

    // If there is no schema we are done. We won't have enough info to coerce. Return original obj.
    if (!schema) {
      return obj
    }

    // array case - recurse
    if (_.isArray(obj)) {
      return _.map(obj, function(v) { // recurse on array and schema together
        return self.coerce(v, schema && schema.items)
      })
    }

    // object case - resurse
    if (_.isObjectLike(obj)) {
      return _.mapValues(obj, function(v, k) { // recurse on obj and schema together
        return self.coerce(v, schema && schema.properties && schema.properties[k])
      })
    }

    // string case. Here we do the actual coercion.
    if (typeof(obj) === 'string') {
      var schemaType = schema.type
      if (schemaType) {
        // numbers and booleans
        if (schemaType === 'number' || schemaType === 'integer' || schemaType === 'boolean') {
          return JSON.parse(obj)
        }

        // ObjectId
        if (schemaType === 'ObjectId') {
          return EJSON.deserialize({ $oid: obj })
        }

        // Date
        if (schemaType === 'Date') {
          return EJSON.deserialize({ $date: obj })
        }
      }
    }

    // If it is not an object, array, or string, we can just return the original obj.
    return obj
  },

  /*****************************************************************************
   * @method validate
   * @description validate description
   * @memberof ejson
   * @param {xxx} obj -- xxx
   * @param {xxx} schema -- xxx
   * @throws {Error} -- xxx
   * @returns {xxx} -- xxx
   */
  validate: function(obj, schema) {
    var options = {}
    var validator = new ZSchema(options)

    schema = this.toJSONSchema(schema)

    var result = {}
    try {
      var isSchemaValid = validator.validateSchema(schema)
      if (!isSchemaValid) {
        throw new Error("Invalid schema.")
      }
      result.valid = validator.validate(obj, schema)
    } catch (e) {
      throw new Error("Exception in compiling schema or validating ejson schema: " +
                      EJSON.stringify(schema) +
                      " data: " + EJSON.stringify(obj) +
                      " -- Reason: " + e.message)
    }
    if (!result.valid) {
      result.error = validator.getLastErrors()[0].message
    }

    return result
  },

  /*****************************************************************************
   * @method toJSONSchema
   * @description toJSONSchema description
   * @memberof ejson
   * @param {xxx} schema -- xxx
   * @returns {xxx} -- xxx
   */
  toJSONSchema: function(schema) {
    var self = this

    if (_.isArray(schema)) {
      return _.map(schema, function(elem) {
        return self.toJSONSchema(elem)
      })
    }

    if (_.isObjectLike(schema)) {
      if (schema.type) {
        var schemaReplacement = self.ejsonSchemas[schema.type]
        if (schemaReplacement) {
          return schemaReplacement
        }
      }
      return _.mapValues(schema, function(v, k) {
        return self.toJSONSchema(v)
      })
    }

    return schema
  },


}

