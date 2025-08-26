const get = require("./get");
const catPics = require("./scripts/client/get-sad-cat");
const amiloggedin = require("./scripts/client/am-i-logged-in");
const api = require("./scripts/api/router");
const fs = require('fs');

const down = false;

const imgExtensions = [".png", ".jpg", ".jpeg", ".gif"];

function serverFunction(request, response) {
  // response.write('hello i am serber');
  // response.end();

  console.log(`[${timeAndDate()}] <${request.connection.remoteAddress}> url: ${request.url}`);

  // special routes
  if (request.url === "/404cat") {
    cat = catPics.getCat();
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(cat);
    response.end();
    console.log("[main/404cat] served text/plain " + cat);
    return;
  } else if (request.url === "/") {
    get.html("/index.html", response);
    return;
  } else if (request.url.startsWith("/api")) {
    api(request, response);
    return;
  } else if (request.url === "/amiloggedin") {
    amiloggedin(request, response);
    return;
  } else if (request.url === "/baking-portfolio-images") {
    fs.readdir('assets/images/baking-portfolio/', (error, data) => {
      if (error) {
        get.json(JSON.stringify(['no data available']), response);
        process.stdout.write("[main/baking-portfolio-images] produced error: ");
        console.log(error);
      } else {
        data = data.filter(name => !(name[0] === '.')); // remove hidden files
        console.log("[main/baking-portfolio-images] serving " + data.length + "image names");
        get.json(JSON.stringify(data), response);
      }
    });
    return;
  } else if (request.url.includes("..")) {
    get.error403(request, response); // prevent silly business
  }

  let i = request.url.lastIndexOf(".");
  if (i > -1) {
    // file directly requested
    let extension = request.url.substring(i);
    extension = extension.toLowerCase();

    console.log("[main/file] serving file type: " + extension);

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
    } else if (extension === ".mp4") {
      get.mp4(request.url, response);
    } else if (extension === ".pdf") {
      get.pdf(request.url, response);
    } else {
      get.error415(extension, response);
      console.log("[main/file] threw 415 (Unsupported Media Type) on file type " + extension);
    }
  } else {
    // using extensionless name
    console.log("[main] (exensionless page)");

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
    get.html(removeQueryString(request.url) + ".html", response);
  }
}

function removeQueryString(uri) {
  i = uri.indexOf("?");
  return i < 0 ? uri : uri.substring(0, i);
}

function timeAndDate() {
  let now = new Date();
  return `${now.getMonth()}-${now.getDate()}-${now.getFullYear()} | ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
}

module.exports = {
  serverFunction,
};
