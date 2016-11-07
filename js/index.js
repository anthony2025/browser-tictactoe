$(document).ready(function() {
  
  // Make sure to use CAPS for everything X/Y related
  var side_colors = {
    'X': '#800E00', // RED
    'Y': '#1B5E20', // GREEN
    '-': '#555555', // GRAY
    'Nobody': '#2196F3', // BLUE
  }
  
  var winPermutations = [
      // horizontal permutations
      [1,2,3],[4,5,6],[7,8,9],
      // vertical permutations
      [1,4,7],[2,5,8],[3,6,9],
      // diagonal permutations
      [1,5,9],[3,5,7]
  ];
  
  // The DOM board gets bitchy if some cells are empty and others not,
  // thus the hyphen '-' to keep all cells full with something
  var JSboard = ['-',  // [0] not used
    '-','-','-', // [ 1 2 3 ]
    '-','-','-', // [ 4 5 6 ]
    '-','-','-', // [ 7 8 9 ]
  ];
  var gameOver;
  var whoMovesNow;
  var whoDoesntMoveNow;
  
  
  // This is called on gameOver and at the start
  function resetGame() {
    // initialize our variables
    whoMovesNow = 'X';
    whoDoesntMoveNow = 'Y';
    gameOver = false;
    // first we clear the JS board
    JSboard = JSboard.map(() => '-');
    // and then refresh everything
    refreshDOM();
  }
  
  function refreshDOM() {
    // Here we refresh the DOM board
    JSboard.forEach(function(side, num) {
      // This refreshes the board values
      $('.' + num).text(side);
      // This refreshes the board colors
      $('.' + num).css('background', side_colors[side]);
    });
    turnDivsHandler();
    dialogHandler();
  }
  
  // Highlight the player that has to move
  function turnDivsHandler() {
    $('.' + whoMovesNow).css('background', side_colors[whoMovesNow]);
    $('.' + whoDoesntMoveNow).css('background', side_colors['-']);
  }
  
  // The dialog shows the turns and winner
  function dialogHandler() {
    if (gameOver) {
      $('.dialog').text(gameOver + ' wins!');
      // Paint everything the color of the winner
      $('.turn div, button').css('background', side_colors[gameOver]);
    }
    else
      $('.dialog').text('Player ' + whoMovesNow + ' moves');
  }
  
  function play() {
    // Better leave this here to avoid bitchy behaviours with 'this' 
    var cell = $(this).attr('class');
    // one additional check here that improves the playability
    if (gameOver)
      resetGame();
    else if (JSboard[cell] === '-') {
      // Here we move
      JSboard[cell] = whoMovesNow;
      // Then update
      refreshDOM();
      // Check if game is over and if so handle it
      gameOver = isGameOver();
      if (gameOver)
        dialogHandler();
      updateTurn();
    }
  }
    
  function updateTurn() {
    // just swapping 'X' with 'Y'
    var temp = whoMovesNow;
    whoMovesNow = whoDoesntMoveNow;
    whoDoesntMoveNow = temp;
    // We REALLY need to call these guys here also
    // I have no idea why... but everything goes to shit if not.
    turnDivsHandler();
    dialogHandler();
  }
  
  // Arrow functions are the shit
  // This returns the winner, 'Nobody', or undefined
  function isGameOver() {
    return ['X','Y'].find(
            player => winPermutations.some(
              perm => perm.every(
                cell => playerToArr(player).includes(cell)))) 
    || isBoardFull();
  }
  
  // 'Nobody' (wins) returned if it is a tie
  // This function is called AFTER checking for wins
  function isBoardFull() {
    if (JSboard.filter(cell => cell !== '-').length === 9)
      return 'Nobody';
  }
  
  // This returns an array with the moves of a particular player
  function playerToArr(player) {
    return JSboard.map(function(cell, index) {
      if(cell === player) return index;
    });
  }
  
  // Bind all board buttons
  $('.board button').click(play);
  // Start the game!
  resetGame();
  
});