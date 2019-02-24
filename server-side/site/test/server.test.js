const assert = require('assert');
const expect = require('chai').expect;
//const main = require('../main')
//const got   = require('got');
const request = require('request');
var http = require('http');
//var server = require('../server');
var shell = require('shelljs')

//describe('Array', function() {
//  describe('#indexOf()', function() {
//    it('should return -1 when the value is not present', function(){
//      assert.equal(-1, [1,2,3].indexOf(4));
//    });
//  });
//});

//describe('main', function() {
//    describe('#start()', function() {
//      it('should start server on port 9001', async () => {

//          await main.start();

//          const response = await got('http://localhost:9001', {timeout:500})
          // Stop server
//          await main.stop();
//          expect(response.body).to.include('Hi From');
//      });
//   });
//});


//describe('Server Test', function() {
//  it('Check checkbox.io!', function() {
    // add server.start()
//    server.start();
//    var response = got('http://192.168.22.150/api/study/vote/status', {timeout:500})
//    http.get('http://192.168.22.150/api/study/vote/status', function(response) {
//    server.close();
//      expect(response.body).to.include('ok');
//      assert.equal(response.statusCode, 200);
//      done();
//    });
//  });
//});

describe('server', function(){
    describe('#start()', function(){
         it('check api status', function() {
         // start server
         this.timeout(0);
         shell.exec('pm2 start server.js');
         http.get('http://192.168.22.250/api/study/vote/status', function(response) {
               expect(response.body).to.include('ok');
         });
         //request('http://localhost', function (error, response, body) {
         //     console.log('statusCode', response && response.statusCode);
         //     assert.equal(response.statusCode, 200);
         //});
         shell.exec('pm2 stop server.js');
         });
    });

//    describe('#stop()', function(){
//          it('should stop the checkbox server', function() {
//         // stop server
//         this.timeout(0);
//          shell.exec('pm2 stop server.js');
//           });
//    });
});
