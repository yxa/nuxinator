var chai      = require('chai'),
    fs        = require('fs-extra'),
    async     = require('async'),
    Nuxinator = require('../lib/nuxinator');

var expect = chai.expect;

describe('Nuxinator',function(){
  describe('start', function(){});
  describe('open', function(){});

  describe('New', function() {
    var config = "test-config.json";
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
      var nuxinator = new Nuxinator();
      fs.createFile(config, function(error){
        nuxinator.create(config, function(error){
          expect(error).to.be.undefined;
          done();
        });
      });
    });
    it('should create the config file if its non existing',function(done){
      var nuxinator = new Nuxinator();
      nuxinator.create(config, function(error){
        expect(error).to.be.true
        done();
      });
    });
    it('should create the root folder if not exists',function(done){
      var nuxinator = new Nuxinator();
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

  describe('copy', function(){});

  describe('Delete', function(){

    var sample = './test/configFiles/sample3.json';

    before(function(done){
      fs.createFile(sample, function(error){
        if(!error) done();
      });
    });

    it('should delete the specified config file', function(done){
      var nuxinator = new Nuxinator();
      nuxinator.erase(sample, function(status){
        expect(status).to.be.true;
        done();
      });
    });
  });

  describe('Implode', function(){
    before(function(done){
      async.map(['./test/configFiles/sample1.json','./test/configFiles/sample2.json'],
          fs.createFile,
          function(err, result){
            if(!err) done();
          });
    });
    it('should delete all the config files', function(done) {
      var nuxinator = new Nuxinator();
      nuxinator.implode('./test/configFiles', function(status){
        expect(status).to.be.true
        done();
      });
    });

  });

  describe('List', function(){
    before(function(done){
      async.map(['./test/configFiles/sample1.json','./test/configFiles/sample2.json'],
          fs.createFile,
          function(err, result){
            if(!err) done();
          });
    });
    it('should list all the config files', function(done) {
      var nuxinator = new Nuxinator();
      nuxinator.list('./test/configFiles', function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.have.length(2);
        expect(result).to.be.eql(['sample1','sample2']);
        done();
      });
    });
  });

});
