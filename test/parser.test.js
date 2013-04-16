var expect    = require('chai').expect,
    Parser    = require('../lib/parser');

describe('Parser',function() {

  var parser;

  before(function(done){
    parser = new Parser();
    done();
  });

  it('should throw error on invalid config file',function(done){
    parser.processConfig('test/assets/invalid-project.json',function(error, config){
      expect(error).to.be.an.instanceof(Error);
      done();
    })
  });

  it('should return config settins on valid config file',function(done){
    parser.processConfig('test/assets/valid-project.json', function(error,config){
      expect(error).to.be.null;
      expect(config).to.be.ok;
      done();
    });
  });
});
