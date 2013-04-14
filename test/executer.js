var chai      = require('chai'),
    fs        = require('fs-extra'),
    async     = require('async'),
    executer  = require('../lib/executer');

var expect = chai.expect;

describe('Executer',function(){

  describe('Sending Keys',function(){
      it('should format the keys command correctly',function(done){
          var cmd = executer.sendKeys('testProject', 1, 'ls');
          expect(cmd).to.be.eql('tmux send-keys -t testProject:1 ls "C-m"');
          done();
      });
  });
});
