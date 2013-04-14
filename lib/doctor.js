var shell = require('shelljs');

var isShellSet = function(callback) {
  callback(process.env.SHELL);
};

var isEditorSet = function(callback) {
  callback(process.env.EDITOR);
};

var isTmuxInstalled = function(callback) {
  callback(shell.which('tmux'));
};

var displayResult = function(status) {
  status ? console.log("YES") : console.log("NO");
}

var diagnose = function() {

  console.log("checking if tmux is installed ==>");
  isTmuxInstalled(function(status){
    displayResult(status);

    console.log("checking if $EDITOR is set ==>");
    isEditorSet(function(status){
      displayResult(status);

      console.log("checking if $SHELL is set ==>");
      isShellSet(function(status){
        displayResult(status);
      });
    });
  });
 };


module.exports = {
  isShellSet: isShellSet,
  isEditorSet: isEditorSet,
  isTmuxInstalled: isTmuxInstalled,
  diagnose: diagnose
};
