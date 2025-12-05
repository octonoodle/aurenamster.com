// load menu bar
window.onload = function() {
    // wrap content
    document.body.innerHTML = `<div id="top-level-content">${document.body.innerHTML}</div>`

    // insert menu bar
    document.body.innerHTML = 
    `<nav id="menu-bar"></nav>\n` + 
    document.body.innerHTML;

    $("#menu-bar").load("/util/menubar.html style,.menu-bar > ", () => {
        // insert page footer
        document.body.innerHTML += `<footer id="the-footer"></footer>`;

        // $("#the-footer").load("/util/footer style,.the-footer > ");
        colorTheMenu();

        // finish loading event listener
        document.dispatchEvent(new Event("menu-bar-loaded"));
    });
}

function colorTheMenu() {
    let path = window.location.pathname;
    let siteSection = path.split('/')[1];
    if (siteSection === '') {
        siteSection = 'home'
    }
    let menu = document.getElementById('menu-bar');
    let text = menu.querySelector(`#${siteSection} h3`);
    if (text == null) return;
    text.style.color = 
    getComputedStyle(document.body)
    .getPropertyValue('--complimentary');
}