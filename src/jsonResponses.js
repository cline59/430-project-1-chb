const users = {};
//respond to json object
const respondJSON = (request, response, status, object) => {
  //header object
  const headers = {
    'Content-Type': 'application/json',
  };

  //response
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//respond without json body
const respondJSONMeta = (request, response, status) => {
  //header object
  const headers = {
    'Content-Type': 'application/json',
  };

  //response
  response.writeHead(status, headers);
  response.end();
};

//return json user object
const getUsers = (request, response) => {
    const responseJSON = {
      users,
    };
  
    respondJSON(request, response, 200, responseJSON);
};

//return 200
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

//404 with message
const notFound = (request, response) => {
    const responseJSON = {
      message: 'The page you are looking for was not found.',
      id: 'notFound',
    };
  
    respondJSON(request, response, 404, responseJSON);
};
//404 without message
const notFoundMeta = (request, response) => {
    respondJSONMeta(request, response, 404);
};

//add player character from post body
const addCharacter = (request, response, body) => {
    // default json
    const responseJSON = {
      message: 'Player level is required.',
    };
    // check if fields exist
    if (!body.id) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  
    //default status code
    let responseCode = 204;
  
    //create new user if name dosen't exist
    if (!users[body.id]) {
      responseCode = 201;
      users[body.id] = {};
    }
  
    //add/update fields
    users[body.id].id = body.id;
    users[body.id].level = body.level;
  
    //sent response if successful
    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204: success with no content. Will not alter the browns
    return respondJSONMeta(request, response, responseCode);
  };

module.exports = {
    getUsers,
    getUsersMeta,
    notFound,
    notFoundMeta,
    addCharacter,
};