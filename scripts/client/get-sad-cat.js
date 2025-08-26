const fs = require('fs');

let imgLocationLocal = './assets/images';
let folderLocation = '/site-down-cats/';
let imgExtensions = ['.png','.jpg','.jpeg'];

function isImageFile(file) {
    let dot = file.lastIndexOf('.');
    if (dot === undefined) {
        throw new Error('isImageFile: file \"' + file + '\" has no recognized extension!');
    }
    let extension = file.substring(dot);
    return imgExtensions.includes(extension);
}

// copy pasted random int function!
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCat() {
    let result;
    try {
        results = fs.readdirSync(imgLocationLocal + folderLocation);
        
        files = results.filter(isImageFile);
        let randomIndex = getRandomInt(0, files.length - 1)
        let selectedCat = files[randomIndex];
        //console.log(imgLocation+selectedCat);
        result = folderLocation+selectedCat;
    } 
    catch {
        result = '/img-not-found.jpg';
        console.log('[get cat] error: no image folder found at '+imgLocation); 
    }
    return result;
}

//console.log('result of thing: '+getCat());

module.exports = {
    getCat
}