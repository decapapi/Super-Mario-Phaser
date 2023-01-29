let title = "Super Mario Phaser";
let index = 0;

let interval = setInterval(positiveTitle, 400);

function isBlackSpace(letter) {
    var code = letter.charCodeAt(0);
    return code === 0x0020;
}

function positiveTitle() {

    if (isBlackSpace(title.charAt(index)))
    index++

    document.title = '🗿 - ' + title.substring(0, index);
    index++;

    if (index > title.length) {
        clearInterval(interval);
        interval = setInterval(negativeTitle, 400);
  } 
}

function negativeTitle() {
    if (isBlackSpace(title.charAt(index)))
    index--

    document.title = '🗿 - ' + title.substring(0, index);
    index--;
  
    if (index < 1) {
        clearInterval(interval);
        interval = setInterval(positiveTitle, 400);
    }
}
