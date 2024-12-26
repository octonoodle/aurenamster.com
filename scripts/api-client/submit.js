// require jQuery
if (typeof jQuery === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-latest.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
}

async function submitForm() {
    const form = new FormData();
    form.append('password', 'gloriaborger')

    fetch('/api/djjads', {
        method: 'POST',
        body: form
    }).then(async (response) => {
        console.log('guh');
        console.log(await response.text());
    });
}