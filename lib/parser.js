var fs    = require('fs-extra'),
    _     = require('underscore'),
    Q     = require('q');

var Parser = function() {

  var isEmpty = function(value) {
    return _.isEmpty(value) || value === "";
  };
  var containsWindows = function(config) {
    return !isEmpty(config.windows);
  };

  var containsProjectName = function(config) {
    return !isEmpty(config.project_name);
  };

  var containsProjectRoot = function(config) {
    return !isEmpty(config.project_root);
  };

  var readConfig = function(path) {
    var defer = Q.defer();
    fs.readJSON(path, function(err, config){
      if(err) {
        defer.reject(err);
      } else {
        defer.resolve(config);
      }
    });
    return defer.promise;
  };

  var validateConfig = function(config) {
    var defer = Q.defer();
    if(containsProjectName(config) && containsProjectRoot(config) && containsWindows(config)) {
      defer.resolve(config);
    } else {
      defer.reject(new Error("validation error"));
    }
    return defer.promise;
  };


  this.processConfig = function(path, callback) {
    readConfig(path)
      .then(function(config){
        return validateConfig(config);
      })
      .then(function(config){
        callback(null,config);
      })
      .fail(function(error){
        callback(error,null);
      })
      .done();
   }
};

module.exports = Parser;
