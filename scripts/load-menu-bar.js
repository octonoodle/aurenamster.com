// insert menu bar
document.body.innerHTML = 
`<nav id="menu-bar"></nav>\n` + 
document.body.innerHTML;

// load menu bar
$.get("/pages/util/menubar.html", function(data){
    $("#menu-bar").html(data);
})