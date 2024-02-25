const partyByLevel = {};
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

const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Service Error. Something went wrong',
    id: 'internalError',
  };
  respondJSON(request, response, 500, responseJSON);
};

const internalMeta = (request, response) => {
  respondJSONMeta(request, response, 500);
};

//return json user object
const getUsers = (request, response) => {
    const responseJSON = {
      partyByLevel,
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

//add user from post body
const addToParty = (request, response, body) => {
    // default json
    const responseJSON = {
      message: 'Amount and Level are both required.',
    };
    // check if fields exist
    if (!body.amount || !body.level) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  
    // default status code
    let responseCode = 204;
  
    //create party if it dosen't exist
    if (!partyByLevel[body.level]) {
      responseCode = 201;
      partyByLevel[body.level] = {};
    }
  
    //add/update fields
    partyByLevel[body.level].level = body.level;
    partyByLevel[body.level].amount = body.amount;
  
    // sent response if successful
    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204 has an empty payload, just a success
    // It cannot have a body, so we just send a 204 without a message
    // 204 will not alter the browser in any way!!!
    return respondJSONMeta(request, response, responseCode);
  };

module.exports = {
    getUsers,
    getUsersMeta,
    notFound,
    notFoundMeta,
    internal,
    internalMeta,
    addToParty,
};