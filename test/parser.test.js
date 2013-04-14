var chai      = require('chai'),
    fs        = require('fs-extra'),
    async     = require('async'),
    parser    = require('../lib/parser');

var expect = chai.expect;

describe('Parser',function() {
  it('should return false on invalid config file',function(done){
    parser.processConfig('test/assets/invalid-project.json',function(error, config){
      expect(error).to.be.an.instanceof(Error);
      done();
    })
  });

  it('should return true on valid config file',function(done){
    parser.processConfig('test/assets/valid-project.json', function(error,config){
      expect(error).to.be.null;
      expect(config).to.be.ok;
      done();
    });
  });
});
