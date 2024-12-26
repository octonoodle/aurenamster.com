const cookies = require("../cookies");
const fs = require("fs");

module.exports = function (request, response) {
  let cookieList = cookies(request);
  response.writeHead(200, { "Content-Type": "text/plain" });
  if (
    cookieList.password === fs.readFileSync("./scripts/api/api.txt").toString()
  ) {
    response.end("true");
    console.log(
      "user at ip [" + request.socket.remoteAddress + "] is logged in"
    );
  } else {
    response.end("false");
    console.log(
      "user at ip [" + request.socket.remoteAddress + "] is logged out"
    );
  }
};
