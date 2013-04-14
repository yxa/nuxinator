var fs        = require('fs-extra'),
    async     = require('async'),
    Q         = require('q'),
    editor    = require('editor'),
    path      = require('path'),
    executer  = require('./executer');

var Nuxinator = function() {

  this.start = function(config, callback) {
    configExists(config)
      .then(function(status) {
        return executer.start(config);
      })
      .then(function(status){
        callback(status);
      })
      .fail(function(error){
        callback(error);
      })
      .done();
  };

  this.create = function(config, callback) {
    jsonPadded(config,function(config) {
      configExists(config)
        .then(function(status){
          callback();
        })
        .fail(function(error) {
          fs.createFile(config, function(err){
            if(err) {
              callback(new Error("Error: Couldnt Create Config File"));
            } else {
              getTemplateConfiguration()
                .then(function(data){
                  fs.writeJSON(config, data, function(err){ if(!err) callback(true); });
                }).done();
            }
          });
        }).done();
      });
  };

  this.erase = function(path, callback) {
    fs.remove(path, function(error) {
      if(error) {
        callback(false);
      } else {
        callback(true);
      }
    });
  };

  var jsonPadded = function(config, callback) {
    callback(config + '.json');
  }

  this.open = function(path, callback) {
    jsonPadded(path, function(path) {
      editor(path, function(code, cb) {
        if(code === 0) {
          callback(true);
        } else {
          callback(false);
        }
      });
    });
  };

  this.implode = function(rootDir, callback) {
    var removeRootDir = function() {
      var defer = Q.defer();
      fs.remove(rootDir, function(err){
        if(err) {
          defer.resolve(err);
        } else {
          defer.resolve();
        }
      });
      return defer.promise;
    };
    removeRootDir()
      .then(function(){
        callback(true);
      })
      .fail(function(error){
        callback(false);
      })
      .done();
  };


  var getConfigNames = function(rootDir) {
    var defer = Q.defer();
    fs.readdir(rootDir, function(err, files) {
      if(err) {
        defer.reject(err);
      } else {
         async.map(files, getBaseName, function(err, result){
          defer.resolve(result);
         });
      }
    });

    function getBaseName(file, callback) {
      callback(null, path.basename(file, '.json'));
    };

    return defer.promise;
  };

  this.list = function(rootDir, callback) {
    getConfigNames(rootDir)
      .then(function(result){
        callback(null, result);
      })
      .fail(function(err){
        callback(err, null);
      })
      .done();
  };


  this.createRootDir = function(path, callback) {
    var createDir = function() {
      var defer = Q.defer();
      fs.exists(path, function(status){
        if(!status){
          fs.mkdirs(path, function(err) {
            if(!err) {
              defer.resolve();
            } else {
              defer.reject(err);
            }
          });
        } else {
          defer.resolve();
        }
      });
      return defer.promise;
    };

    createDir(path)
      .then(function(){ callback(true);  })
      .fail(function(){ callback(false); })
      .done();
  };

  this.getRootDir = function(){
    //return process.env['HOME'] + '/.nuxinator';
    return '/tmp/.nuxinator/';
  };


  var getTemplateConfiguration = function() {
    var defer = Q.defer();
    fs.readJson("assets/template.json", function(err, data){
      if(err) {
        defer.reject(err);
      } else {
        defer.resolve(data);
      }
    });
    return defer.promise;
  };

  var configExists = function(config) {
    var defer = Q.defer();
    fs.exists(config,function(status){
      if(status) {
        defer.resolve(status);
      } else {
        defer.reject(status);
      }
    });
    return defer.promise;
  };
};

module.exports = Nuxinator
