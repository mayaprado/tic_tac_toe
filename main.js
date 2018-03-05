function init() {
  board.render();
}

var toe = ['tic', 'tac'];
// array toe contains two classes (X and O) and by reversing this array
// the classes will be toggled
var ticArr = [];
// this array will contain all played X-s
var tacArr = [];
// this array will contain all played O-s;
var playerId = [];
// this array will containt IDs of all X-s or O-s. it will switch after every move
var player = {
  winner: winner,
  value: null,
};
// this object contains winner function and as a value - X or O depending on who just moved.
// it will only contain a value of a player who made to most recent move
var crossSound = document.querySelector('.cross');
// assigning all sound effects to variables
var circleSound = document.querySelector('.circle');
var winSound = document.querySelector('.win');
var drawSound = document.querySelector('.draw');
var againSound = document.querySelector('.again');
var banner = document.createElement('div');

var scoreX = 0;
var scoreO = 0;
// creating variables for keeping score

var scoreBoard = document.createElement('div');
// creating score board
scoreBoard.classList.add('scores');

banner.setAttribute('id', 'banner');
banner.textContent = "Let's Play! X goes first";
// banner for informong whose move is next and who won
var title = document.querySelector('h1');
title.appendChild(banner);

var startOver = document.createElement('div');
startOver.setAttribute('id', 'playagain');
startOver.textContent = 'Play Again';
// creating a "play again" button that will only appear when a game is over
var grid = document.querySelector('#grid-container');
startOver.addEventListener('click', playAgain);

// below is a function that enables a player to play with computer. Computer is alwayes playing O.
// there is however one major thing that I'm still working on - right now all moves of computer are random
// which means that computer "is not trying to win" and doesn't have any logic behind moves.
// to turn off this mode comment out line 96

var k;
function computerMove() {
  // function for alternative computer move
  if (ticArr.length < 5) {
    // if amount of
    k = Math.floor(Math.random() * 9);
    // assigning a random number from 0 to 9 to k
    if (cells[k].classList != 'cell tic' && cells[k].classList != 'cell tac') {
      setTimeout(function() {
        cells[k].click();
        // if the cell wasn't clicked before click it
      }, 300);
    } else {
      computerMove();
      // if a cell was clicked before - invoce computerMove again with new k value.
    }
  }
}

function play(e) {
  // this function makes a cell an X or O;
  e.target.classList.add(toe[0]);
  toe = toe.reverse();
  // toggling classes by reversing array of classes after each move
  if (e.target.classList.contains('tic')) {
    ticArr.push(e.target);
    // adding X to the array of played X-s
    crossSound.play();
    banner.textContent = 'O goes next';
    e.target.removeEventListener('click', play);
    // removing event listener from a cell that has been played
    if (ticArr.length === 5) {
      // when the last empty cell is played
      banner.textContent = 'DRAW!';
      drawSound.play();
      // in case a win combination was't played, change banner to "Draw!"
      whoWon('x');
      // after that check for a win combination
    } else if (ticArr.length >= 3) {
      whoWon('x');
      // if array of X-s is 3 or longer - checking for a win combination
    }
    computerMove();
    // after X played - computer is playing O
  } else if (e.target.classList.contains('tac')) {
    tacArr.push(e.target);
    // adding O to the array of played O-s
    circleSound.play();
    banner.textContent = 'X goes next';
    e.target.removeEventListener('click', play);
    if (tacArr.length >= 3) {
      whoWon('o');
      // if array of O-s is 3 or longer - checking for a win combination
    }
  }
}

function renderRow(rowIdx) {
  // to create a grid I'm using a code the Drake wrote during the class (lines 111 to 152)
  // creating cells and appending them to raws
  var rowEl = document.createElement('div');
  rowEl.classList.add('row');
  for (var i = 0; i < 3; i++) {
    var cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', play);
    rowEl.appendChild(cell);
  }
  return rowEl;
}

function renderGrid() {
  // creating rows and appending them to grid
  var newEl = document.createElement('div');
  newEl.classList.add('grid');
  for (var i = 0; i < 3; i++) {
    var newRow = this.renderRow(i);
    newRow.setAttribute('id', '' + i);
    newEl.appendChild(newRow);
  }
  return newEl;
}

function render() {
  // creating grid and appending it to the board
  var gridEl = document.querySelector('#grid-container');
  gridEl.innerHTML = '';
  gridContent = this.renderGrid();
  gridEl.classList.add('board');
  gridEl.appendChild(gridContent);
}

var board = {
  render: render,
  renderGrid: renderGrid,
  renderRow: renderRow,
};

init();

grid.appendChild(startOver);
title.appendChild(scoreBoard);
// appending startOver button and scoreboard
scoreBoard.textContent = scoreX + ' : ' + scoreO;

var cells = document.querySelectorAll('.cell');
// array of all cells

function cellId() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].setAttribute('id', 'a' + i);
    // setting unique number as id for each cell to check win combinations later
  }
}

cellId();

function whoWon(el) {
  // checking for a win combination using X or O as a parameter
  if (el === 'x') {
    playerId = ticArr.map(function(el) {
      return el.id;
      // adding IDs of played X-s to an array od IDs of a current player
    });
    player.value = 'X';
    // setting value of a current player to X
    combination();
    // checking for win combination
  } else if (el === 'o') {
    playerId = tacArr.map(function(el) {
      return el.id;
      // adding IDs of played O-s to an array od IDs of a current player
    });
    player.value = 'O';
    // setting value of a current player to O
    combination();
    // checking for win combination
  }
}

function combination() {
  // checking for 8 possible win combinations
  if (
    playerId.includes('a0') &&
    playerId.includes('a1') &&
    playerId.includes('a2')
  ) {
    player.winner();
  } else if (
    playerId.includes('a3') &&
    playerId.includes('a4') &&
    playerId.includes('a5')
  ) {
    player.winner();
  } else if (
    playerId.includes('a6') &&
    playerId.includes('a7') &&
    playerId.includes('a8')
  ) {
    player.winner();
  } else if (
    playerId.includes('a0') &&
    playerId.includes('a3') &&
    playerId.includes('a6')
  ) {
    player.winner();
  } else if (
    playerId.includes('a1') &&
    playerId.includes('a4') &&
    playerId.includes('a7')
  ) {
    player.winner();
  } else if (
    playerId.includes('a2') &&
    playerId.includes('a5') &&
    playerId.includes('a8')
  ) {
    player.winner();
  } else if (
    playerId.includes('a0') &&
    playerId.includes('a4') &&
    playerId.includes('a8')
  ) {
    player.winner();
  } else if (
    playerId.includes('a2') &&
    playerId.includes('a4') &&
    playerId.includes('a6')
  ) {
    player.winner();
  } else {
    return;
  }
}

function winner() {
  // if there's a win combination tnis function will be invoked
  banner.textContent = this.value + ' WON!';
  // changing content of banner to X or O won
  winSound.play();
  if (this.value === 'X') {
    scoreX += 1;
  } else {
    scoreO += 1;
  }
  scoreBoard.textContent = scoreX + ' : ' + scoreO;
  // adjusting score board
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', play);
  }
  // removing event listener from all cells
}

function playAgain() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].classList.remove('tic');
    // setting all X cells back to clear
    cells[i].addEventListener('click', play);
    // adding event listener to all cells
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].classList.remove('tac');
    // setting all O cells back to clear
  }
  banner.textContent = "Let's Play! X goes first";
  againSound.play();
  player.value = null;
  playerId = [];
  ticArr = [];
  tacArr = [];
  toe = ['tic', 'tac'];
  // changing all values back to null or undefined
}
