let title = "Super Mario Phaser";
let index = 0;
let direction = 1;

let interval = setInterval(updateTitle, 400);

function isWhiteSpace(letter) {
  const code = letter.charCodeAt(0);
  return code === 0x0020;
}

function updateTitle() {
  index += direction;
  
  if (isWhiteSpace(title.charAt(index))) {
    index += direction;
  }

  document.title = '🗿 - ' + title.substring(0, index);

  if (index >= title.length || index <= 0) {
    direction *= -1;
  }
}
