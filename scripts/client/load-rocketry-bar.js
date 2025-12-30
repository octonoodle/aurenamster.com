// load menu bar
document.addEventListener("menu-bar-loaded", function() {
    // wrap content
    //document.body.innerHTML = `<div id="top-level-content">${document.body.innerHTML}</div>`

    // insert menu bar
    $("#menu-bar").after(`<nav id="rocketry-bar"></nav>\n`);

    $("#rocketry-bar").load("/util/rocketrybar.html style,.rocketry-bar > ", () => {
        // insert page footer
        //document.body.innerHTML += `<footer id="the-footer"></footer>`;

        // $("#the-footer").load("/util/footer style,.the-footer > ");
        colorTheRockMenu();

        // finish loading event listener
        // document.dispatchEvent(new Event("menu-bar-loaded"));
    });
});

function colorTheRockMenu() {
    let path = window.location.pathname;
    let siteSection = path.split('/')[2]; // assume start is /rocketry
    if (path === '/rocketry') {
        siteSection = 'rocketry2' // rocketry is for the main bar
    }

    let menu = document.getElementById('rocketry-bar');
    let text = menu.querySelector(`#${siteSection} h3`);
    if (text == null) return;
    text.style.color = 
    getComputedStyle(document.body)
    .getPropertyValue('--complimentary');
}