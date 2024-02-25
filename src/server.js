//http server module
const http = require('http');
//URL module
const url = require('url');
//query string module
const query = require('querystring');
//response handler files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
//port
const port = process.env.PORT || process.env.NODE_PORT || 3000;