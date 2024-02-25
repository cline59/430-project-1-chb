//file system module
const fs = require('fs');
//load files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

//handles index page
const getIndex = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(index);
    response.end();
  };
//handles CSS
const getCSS = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(css);
    response.end();
  };

//export
module.exports = {
  getIndex,
  getCSS,
};