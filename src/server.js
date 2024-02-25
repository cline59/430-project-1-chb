/* Plan is to create a website like Kobold Fight Club (https://koboldplus.club/).
 * Users can add characters (only things considered are amount and level), then add monsters
 * (only things considered are amount and challenge rating), and the site compares them to see
 * how difficult the encounter would be. For simplicity, I'll start by hard coding a
 * few monsters to use, but my Take It Further goal would be to let users search and
 * pull monsters from a 5e API.
 */

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

//URL Object
const urlStruct = {
    GET: {
      '/': htmlHandler.getIndex,
      '/style.css': htmlHandler.getCSS,
      '/getCharacters': jsonHandler.getCharacters,
      '/getMonsters': jsonHandler.getMonsters,
      '/internal': jsonHandler.internal,
      notFound: jsonHandler.notFound,
    },
    HEAD: {
      '/getCharacters': jsonHandler.getCharactersMeta,
      '/getMonsters': jsonHandler.getMonstersMeta,
      '/internal': jsonHandler.internalMeta,
      notFound: jsonHandler.notFoundMeta,
    },
    POST: {
        '/addToParty': jsonHandler.addToParty,
        '/addMonster': jsonHandler.addMonster,
    },
};
//recompiles body of request and calls correct handler
const parseBody = (request, response, handler) => {
    const body = [];
  
    //sends 400 message if an error exists
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    //assemble data chunks into the body
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    //converts body to string and calls handler
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
  
      handler(request, response, bodyParams);
    });
  };

//handle post requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addToParty') {
      parseBody(request, response, jsonHandler.addToParty);
    }
    if (parsedUrl.pathname === '/addMonster') {
        parseBody(request, response, jsonHandler.addMonster);
    }
};

//request handler
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    //reports not found if not part of urlStruct
    if (!urlStruct[request.method]) {
        return urlStruct.HEAD.notFound(request, response);
    }

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
      } else {
        if (urlStruct[request.method][parsedUrl.pathname]) {
            return urlStruct[request.method][parsedUrl.pathname](request, response);
        }
        return urlStruct[request.method].notFound(request, response);
    }

};

// start server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});