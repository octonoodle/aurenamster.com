const get = require("./get");
const catPics = require("./scripts/client/get-sad-cat");
const amiloggedin = require("./scripts/client/am-i-logged-in");
const api = require("./scripts/api/router");

const down = false;

const imgExtensions = [".png", ".jpg", ".jpeg", ".gif"];

function serverFunction(request, response) {
  // response.write('hello i am serber');
  // response.end();

  console.log("url: " + request.url);

  let i = request.url.lastIndexOf(".");
  if (i > -1) {
    // file directly requested
    let extension = request.url.substring(i);

    console.log("serving file type: " + extension);

    if (down) get.error503(response);

    // serve simple html
    if (extension === ".html") {
      get.html(request.url, response);
    } else if (imgExtensions.includes(extension)) {
      get.img(request.url, extension, response);
    } else if (extension === ".js") {
      get.js(request.url, response);
    } else if (extension === ".css") {
      get.css(request.url, response);
    } else if (extension === ".svg") {
      get.svg(request.url, response);
    } else {
      get.error415(extension, response);
      console.log("[main/file] threw 415 (Unsupported Media Type) on file type " + extension);
    }
  } else {
    // using extensionless name
    console.log("(exensionless page)");

    // special routes
    if (request.url === "/404cat") {
      cat = catPics.getCat();
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.write(cat);
      response.end();
      console.log("served text/plain " + cat);
      return;
    } else if (request.url === "/") {
      get.html("/pages/index.html", response);
      return;
    } else if (request.url.startsWith("/api")) {
      api(request, response);
      return;
    } else if (request.url === "/amiloggedin") {
      amiloggedin(request, response);
      return;
    }

    // fs.readFile('pages/sources.json', (error, data) => {
    //     if (error) {
    //         console.log('no such file pages/sources.json');
    //         throw new Error('404 on ' + request.url);
    //     } else {
    //         let json = JSON.parse(data);
    //         let sourceKey = Object.keys(json).find(str => str === request.url);
    //         let page = json[sourceKey];
    //         if (page) {
    //             get.html(page, response)
    //         } else {
    //             get.error404(page, response);
    //         }
    //     }
    // })
    get.html("/pages" + removeQueryString(request.url) + ".html", response);
  }
}

function removeQueryString(uri) {
  i = uri.indexOf("?");
  return i < 0 ? uri : uri.substring(0, i);
}

module.exports = {
  serverFunction,
};
