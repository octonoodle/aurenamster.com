// load menu bar
window.onload = function() {
    // insert menu bar
    document.body.innerHTML = 
    `<nav id="menu-bar"></nav>\n` + 
    document.body.innerHTML;

    $("#menu-bar").load("/pages/util/menubar.html style,.menu-bar > ", colorTheMenu);
}

function colorTheMenu() {
    let path = window.location.pathname;
    let siteSection = path.split('/')[1];
    if (siteSection === '') {
        siteSection = 'home'
    }
    menu = document.getElementById('menu-bar');
    text = menu.querySelector(`#${siteSection} h3`);
    if (text == null) return;
    text.style.color = 
    getComputedStyle(document.body)
    .getPropertyValue('--complimentary');
}