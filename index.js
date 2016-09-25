'use strict';

var Joi = require('joi');

module.exports = valueObtainer;

/**
 * Function builder.
 *
 * Build a function that validates a value or a sub-element of an object (any level) and returns it.
 *
 * @param  {String} fnName Optional, the name for the generated function
 * @param  {Object} schema A Joi schema
 * @param  {String} path   Same as for Joi.reach(schema, path)
 * @return {Function}
 */
function valueObtainer(fnName, schema, path) {
  // Function name is optional.
  if (fnName == null || typeof fnName === 'object') {
    path = schema;
    schema = fnName;
    fnName = 'ensureValue';
  }

  // Validate schema.
  schema = Joi.compile(schema);

  // Function body.
  let body;

  // Path is optional.
  if (path == null) {
    // Validate the value.
    body = 'return Joi.attempt(value, schema);';
  } else {
    // Validate path.
    Joi.assert(path, Joi.string().trim());
    const parts = path.split('.');

    // Get sub-schema.
    schema = Joi.reach(schema, path);

    // Build a new top-level schema.
    for (let i = parts.length - 1; i >= 0; i--) {
      let keys = {};
      keys[parts[i]] = schema.required();
      schema = Joi.object(keys).unknown();
    }

    // Validate the top-level value.
    body = 'let res = Joi.attempt(value, schema);';

    // Get the target value.
    for (let i = 0, len = parts.length; i < len; i++) {
      body += `res = res['${parts[i]}'];`;
    }
    body += 'return res;';
  }

  // Build a function generator and run it.
  const generator = new Function('Joi', 'schema', `'use strict';
  return function ${fnName}(value) {
    ${body}
  };`);
  return generator(Joi, schema);
}
