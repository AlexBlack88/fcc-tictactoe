var human;
var computer;

$(document).ready(function() {
  
  $('#pickX').click(function(){
      human = 'X';
      computer = 'O';
  });
  
  $('#pickO').click(function(){
      human = 'O';
      computer = 'X';
  });
  
    const grid = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function gameOver(grid) {
        // Horizantal
        for (var i = 0; i < 3; i++) {
            if (grid[i][0] !== '' &&
                grid[i][0] === grid[i][1] &&
                grid[i][0] === grid[i][2]) {
                return grid[i][0];
            }
        }
        // Vertical
        for (var j = 0; j < 3; j++) {
            if (grid[0][j] !== '' &&
                grid[0][j] === grid[1][j] &&
                grid[0][j] === grid[2][j]) {
                return grid[0][j];
            }
        }
        // Diagonal - top left
        if (grid[0][0] !== '' &&
            grid[0][0] === grid[1][1] &&
            grid[0][0] === grid[2][2]) {
            return grid[0][0];
        }
        // Diagonal - bottom left
        if (grid[2][0] !== '' &&
            grid[2][0] === grid[1][1] &&
            grid[2][0] === grid[0][2]) {
            return grid[2][0];
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (grid[i][j] === '') {
                    return false;
                }
            }
        }

        return null;
    }

    function minmax(newGrid, depth, player) {
        const gameState = gameOver(newGrid);

        if (gameState === false) {
            const values = [];
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    const gridCopy = _.cloneDeep(newGrid);
                    if (gridCopy[i][j] !== '') continue;
                    gridCopy[i][j] = player;
                    let value = minmax(gridCopy, depth + 1, ((player === human) ? computer : human));
                    values.push({
                        cost: value,
                        cell: {
                            i: i,
                            j: j
                        }
                    });
                }
            }
            if (player === computer) {
                const max = _.maxBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return max.cell;
                } else {
                    return max.cost;
                }
            } else {
                const min = _.minBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return min.cell;
                } else {
                    return min.cost;
                }

            }
        } else if (gameState === null) {
            return 0;
        } else if (gameState === human) {
            return depth - 10;
        } else if (gameState === computer) {
            return 10 - depth;
        }
    }

    function computerMove() {
        return minmax(grid, 0, computer);
    }

    $('.cell').click(function() {

        let gameState = gameOver(grid);

        if (gameState || gameState === null) {
            return;
            
        }

        $this = $(this);
        const i = $this.data('i');
        const j = $this.data('j');
        if (grid[i][j] !== '') {
            return;
        }

        $this.html(human);

        grid[i][j] = human;

        gameState = gameOver(grid);

        if (gameState) {
          $('.gameover').css('display', 'block');
            $('.gameover').html('<p>Game over: ' + gameState + ' is the winner! Try again?</p>');
            
            setTimeout(function() {
              $('.gameover').css('display', 'none');
                $('.gameover').html('');
            }, 5000);
            return;
        } else if (gameState === null) {
                    $('.gameover').css('display', 'block');
          $('.gameover').html('<p>Game is drawn! Try again</p>');
          setTimeout(function() {
            $('.gameover').css('display', 'none');
              $('.gameover').html('');
          }, 5000);
            return;
        } else {
            const move = computerMove();
            grid[move.i][move.j] = computer;
            
            $('.cell[data-i=' + move.i + '][data-j=' + move.j + ']').html(computer);
        }

        gameState = gameOver(grid);
        if (gameState) {
                    $('.gameover').css('display', 'block');
            $('.gameover').html('<p>Game over: ' + gameState + ' is the winner! Try again?</p>');
            setTimeout(function() {
                $('.gameover').css('display', 'none');
                $('.gameover').html('');
            }, 5000);
        }
    });

    $('#reset').click(function() {

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                grid[i][j] = '';
                $('.cell[data-i=' + i + '][data-j=' + j + ']').html(' ');
            }
        }
    });

});