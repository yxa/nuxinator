var chai      = require('chai'),
    fs        = require('fs-extra'),
    async     = require('async'),
    path      = require('path'),
    Nuxinator = require('../lib/nuxinator');

describe('Nuxinator', function(){

  var rootDir = './test/configs/';
  var samples = [rootDir + 'sample1.json', rootDir + 'sample2.json'];
  var nuxinator = new Nuxinator();
  var expect = chai.expect;

  var JSONBaseName = function(file, callback) {
    callback(path.basename(file, '.json'));
  };

  describe('New', function() {
    var config = 'test-config.json';
    afterEach(function(done){
      fs.remove(config, function(error){
        if(!error) {
          done();
        } else {
          throw error;
        }
      });
    });
    it('should continue if config file already exists' ,function(done){
      fs.createFile(config, function(error){
        JSONBaseName(config, function(stripped) {
          nuxinator.create(stripped, function(error){
            expect(error).to.be.undefined;
            done();
          });
        });
      });
    });

    it('should create the config file if its non existing',function(done){
      JSONBaseName(config, function(stripped){
        nuxinator.create(stripped, function(error){
          expect(error).to.be.true
          done();
        });
      });
    });

    it('should create the root folder if not exists',function(done){
      var tempDir = './test/rootDir';
      nuxinator.createRootDir(tempDir, function(status){
        expect(status).to.be.true;
        fs.exists(tempDir, function(status){
          if(status) {
            fs.remove(tempDir, function(error) {
              if(!error) done();
            });
          }
        });
      });
    });
  });

  describe('Delete', function(){
    var sample = rootDir + 'sample3.json';
    before(function(done){
      fs.createFile(sample, function(error){
        if(!error) done();
      });
    });

    it('should delete the specified config file', function(done){
      nuxinator.erase(sample, function(status){
        expect(status).to.be.true;
        done();
      });
    });
  });

  describe('Implode', function(){
    before(function(done){
      async.map(samples,
        fs.createFile,
        function(err, result) {
          if(!err) done();
        });
    });

    it('should delete all the config files', function(done) {
      nuxinator.implode(rootDir, function(status){
        expect(status).to.be.true
        done();
      });
    });
  });

  describe('List', function(){
    before(function(done){
      async.map(samples,
        fs.createFile,
        function(err, result){
          if(!err) done();
        });
    });
    it('should list all the config files', function(done) {
      nuxinator.list(rootDir, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.have.length(2);
        expect(result).to.be.eql(['sample1','sample2']);
        done();
      });
    });
  });
});
