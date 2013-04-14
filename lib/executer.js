var exec    = require('child_process').exec,
    shell   = require('shelljs'),
    parser  = require('./parser'),
    Q       = require('q');

var getTmuxBaseIndex = function(path, callback) {
  var defaultBaseIndex = 0;
  exec("grep base-index " + path + " | cut -d ' ' -f 4", function(error, stdout, stderr){
    if(error || stderr){
      callback(defaultBaseIndex);
    } else {
      callback(parseInt(stdout));
    }
  });
};

var start = function(config) {
  var defer = Q.defer();
  parser.processConfig(config, function(error, config){
   if(error) {
      defer.reject(error);
   } else {
      //TODO: replace the current running process, node-kexec not working!
      defer.resolve(true);
   }
  });
  return defer.promise;
};

var sendKeys = function(projectName, windowNumber, cmd) {
  return "tmux send-keys -t " + window(projectName, windowNumber) +  " " + cmd + " " +  '"C-m"';
};

var window = function(projectName, windowNumber) {
  return projectName + ":" + windowNumber;
};


module.exports = {
      getTmuxBaseIndex: getTmuxBaseIndex,
      sendKeys: sendKeys,
      start: start
}

