'use strict';

var should = require('should');
var Joi = require('joi');

var valueObtainer = require('../');

describe('The valueObtainer', function() {

  it('should be there', function() {
    valueObtainer.should.be.Function();
  });

  var schema = Joi.object({
    lorem: Joi.string().trim()
  });

  it('can build a function', function() {
    valueObtainer('xxx', schema).should.have.type('function');
  });

  it('can build a function', function() {
    valueObtainer('xxx', schema, 'lorem').should.have.type('function');
  });

  it('can build a function', function() {
    valueObtainer(schema).should.have.type('function');
  });

  it('can build a function', function() {
    valueObtainer(schema, 'lorem').should.have.type('function');
  });

  it('can throw', function() {
    (function() {
      valueObtainer();
    }).should.throw();
  });

  it('can throw', function() {
    (function() {
      valueObtainer({}, 'lorem');
    }).should.throw();
  });

  it('can throw', function() {
    (function() {
      valueObtainer(Joi.string(), 'lorem');
    }).should.throw();
  });

  it('can throw', function() {
    (function() {
      valueObtainer('lorem', {}, 'lorem');
    }).should.throw();
  });

  describe('An obtainer', function() {

    var ensureLorem;

    it('can be created', function() {
      ensureLorem = valueObtainer('ensureLorem', schema, 'lorem');
      ensureLorem.should.have.type('function');
    });

    it('can validate and get value', function() {
      ensureLorem({
        lorem: 'lorem ipsum'
      }).should.equal('lorem ipsum');
    });

    it('can throw', function() {
      (function() {
        ensureLorem({
          lorem: 123
        });
      }).should.throw();
    });

    it('can throw', function() {
      (function() {
        ensureLorem({
          ipsum: 'lorem ipsum'
        });
      }).should.throw();
    });

    it('can throw', function() {
      (function() {
        ensureLorem('lorem');
      }).should.throw();
    });

  });

});
