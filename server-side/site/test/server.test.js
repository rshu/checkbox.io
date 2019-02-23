const assert = require('assert');
const expect = require('chai').expect;
const main = require('../main')
const got   = require('got');
const request = require('request');
var http = require('http');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('main', function() {
    describe('#start()', function() {
      it('should start server on port 9001', async () => {

          await main.start();

          const response = await got('http://localhost:9001', {timeout:500})
          // Stop server
          await main.stop();
          expect(response.body).to.include('Hi From');
      });
   });
});
