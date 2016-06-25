var ZSchema = require('z-schema')
var _ = require('lodash')
var EJSON = require('mongodb-extended-json')
var bson = require('leafnode').mongodb

/******************************************************************************
 * EJSON
 */
module.exports = {

  /**********************************************************************
   * ejsonTypeReplacements
   */       
  ejsonTypeReplacements: {
    ObjectId: { 
      type: 'object',
      required: ['$oid'],
      properties: {
        '$oid' : { type: 'string' }
      }
    },
    Date: { 
      type: 'object',
      required: ['$date'],
      properties: {
        '$date' : { type: 'string' }
      }
    },
    Timestamp: { 
      type: 'object',
      required: ['$timestamp'],
      properties: {
        '$timestamp' : { type: 'string' }
      }
    },
    Regex: { 
      type: 'object',
      required: ['$regex'],
      properties: {
        '$regex' : { type: 'string' },
        '$options': { type: 'string' }
      }
    },
    Undefined: { 
      type: 'object',
      required: ['$undefined'],
      properties: {
        '$undefined': { type: 'boolean' }
      }
    },
    MinKey: { 
      type: 'object',
      required: ['$minKey'],
      properties: {
        '$minKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    MaxKey: { 
      type: 'object',
      required: ['$maxKey'],
      properties: {
        '$maxKey': { type: 'number', minimum: 1, maximum: 1 }
      }
    },
    NumberLong: { 
      type: 'object',
      required: ['$numberLong'],
      properties: {
        '$numberLong': { type: 'string' }
      }
    },
    Ref: { 
      type: 'object',
      required: ['$ref'],
      properties: {
        '$ref': { type: 'string' },
        '$id': {} // XXX not sure about this -- want any type
      }
    }
    
  },

  /**********************************************************************
   * isObjectId
   */
  isObjectId: function(obj) {
    return obj instanceof this.ObjectId
  },

  /**********************************************************************
   * ObjectId
   */
  ObjectId: bson.ObjectId,

  /**********************************************************************
   * MinKey
   */
  MinKey: bson.MinKey,

  /**********************************************************************
   * MaxKey
   */
  MaxKey: bson.MaxKey,

  /**********************************************************************
   * Timestamp
   */
  Timestamp: bson.Timestamp,

  /**********************************************************************
   * serialize
   */      
  serialize: function(ejson) {
    return EJSON.serialize(ejson)
  },

  /**********************************************************************
   * deserialize
   */      
  deserialize: function(ejson) {
    return EJSON.deserialize(ejson)
  },

  /**********************************************************************
   * parse
   */      
  parse: function(str) {
    return EJSON.parse(str)
  },

  /**********************************************************************
   * stringify
   */      
  stringify: function(str) {
    return EJSON.stringify(str)
  },

  /**********************************************************************
   * coerce
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
        if (schemaType === 'number' || schemaType === 'boolean') {
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

  /**********************************************************************
   * validate
   */       
  validate: function(obj, schema) {
    var options = {}
    var validator = new ZSchema(options)

    schema = this._expandEJSONSchema(schema)
    
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

  /**********************************************************************
   * _expandEJSONSchema
   */       
  _expandEJSONSchema: function(schema) {
    var self = this

    if (_.isArray(schema)) {
      return _.map(schema, function(elem) {
        return self._expandEJSONSchema(elem)
      })
    }

    if (_.isObjectLike(schema)) {
      if (schema.type) {
        var typeReplacement = self.ejsonTypeReplacements[schema.type]
        if (typeReplacement) {
          return typeReplacement
        }
      }
      return _.mapValues(schema, function(v, k) {
        return self._expandEJSONSchema(v)
      })
    }

    return schema
  },

  
}

