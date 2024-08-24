
head = document.head//document.getElementsByTagName('head')[0];

// load styling resources
head.innerHTML = head.innerHTML + `<link rel="icon" href="/images/site-logo.jpg" />\n`;
head.innerHTML = head.innerHTML + `<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=space-grotesk@300,400,500,600,700,1&display=swap">\n`
head.innerHTML = head.innerHTML + `<link rel="stylesheet" href="/styles/default.css">\n`

if (typeof jQuery === "undefined") {
    var script = document.createElement('script');
    script.src = 'http://code.jquery.com/jquery-latest.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
}