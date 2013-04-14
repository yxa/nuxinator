var chai      = require('chai'),
    fs        = require('fs-extra'),
    doctor    = require('../lib/doctor');

var expect = chai.expect;

describe('Doctor Nux',function(){

  it('should false if editor variable does not exists',function(done){
      delete process.env.EDITOR;
      doctor.isEditorSet(function(status) {
        expect(status).to.be.undefined;
        done();
      });
  });

  it('should true if editor variable exists',function(done) {
      process.env.EDITOR = 'vi';
      doctor.isEditorSet(function(status) {
        expect(status).to.be.eql('vi');
        done();
      });
  });

  it('should false if shell variable does not exists',function(done){
      delete process.env.SHELL;
      doctor.isShellSet(function(status) {
        expect(status).to.be.undefined;
        done();
      });
  });

  it('should true if shell variable exists',function(done) {
      process.env.SHELL = '/usr/local/bin/zsh';
      doctor.isShellSet(function(status) {
        expect(status).to.be.eql('/usr/local/bin/zsh');
        done();
      });
  });
});

