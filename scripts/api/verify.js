const fs = require("fs");
const get = require("../../get");
const parseCookie = require("../cookies");

function verifyContinue(request, response, verifiedAction) {
  let password = parseCookie(request).password;
  if (password !== fs.readFileSync("./scripts/api/api.txt").toString()) {
    // validate password
    console.log("[api/auth] password authentication failed, aborting...");
    get.html("/pages/util/api-results/auth-failed.html", response);
  } else {
    console.log("[api/auth] password authentication success");
    verifiedAction(password);
  }
}

module.exports = verifyContinue;