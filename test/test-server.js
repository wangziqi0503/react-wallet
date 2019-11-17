var assert = require("assert");
var request = require('supertest');
var baseUrl = 'http://10.50.3.117:8560/';
const express = require('express');

const app = express();

describe('接口检测', function(){
  describe('请求红包接口检测', function(){
    it('应该返回正确的数据格式', function(done){
	    request(app)
	      .get('http://10.50.3.117:8560/redpack_api_getpack/do?guid=guid&os=os&deviceid=deviceid&token=token')
	      .expect(200, done);    	
    })
  });
})