//how would I add a draw condition
// Define the Gameboard function, which initializes and manages the game board
function Gameboard() {
    // Set the dimensions of the Tic Tac Toe board
    const rows = 3;
    const columns = 3;
    // Initialize the board as an empty array
    const board = [];

    // Fill the board with cells by looping through each row and column
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            // Initialize each cell with a new Cell instance
            board[i].push(Cell());
        }
    }

    // Function to print the current state of the board to the console
    function printBoard() {
        let boardWithCellValues = [];
        for (let i = 0; i < board.length; i++) {
            let rowValues = [];
            for (let j = 0; j < board[i].length; j++) {
                // Get the value of each cell and add it to the rowValues array
                rowValues.push(board[i][j].getValue());
            }
            // Add the current row's values to the board representation
            boardWithCellValues.push(rowValues);
        }
        // Log the board representation to the console
        console.log(boardWithCellValues);
    }

    // Function to place a token at a specified location on the board
    function placeToken(row, column, player) {
        // Check if the specified location is within the bounds of the board
        if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
            console.log("Invalid cell. Please choose a valid row and column.");
            return;
        }

        // Access the specified cell
        const cell = board[row][column];

        // Check if the cell is already occupied
        if (cell.getValue() !== "") {
            console.log("This cell is already occupied. Please choose another cell.");
            return;
        }

        // If the cell is not occupied, place the player's token in the cell
        cell.addToken(player);
    }

    // Function to check if there is a win condition on the board
    function checkWin() {
        // Define all possible winning combinations
        const winningCombinations = [
            // Rows
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Columns
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        // Check each winning combination
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            // Check if the cells in the combination are all occupied by the same player
            if (board[a[0]][a[1]].getValue() && board[a[0]][a[1]].getValue() === board[b[0]][b[1]].getValue() && board[a[0]][a[1]].getValue() === board[c[0]][c[1]].getValue()) {
                return true; // A win is detected
            }
        }

        return false; // No win condition is found
    }

    // Function to check if the game is a draw
    function checkDraw() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() === "") {
                    return false; // Found an empty cell, so it's not a draw
                }
            }
        }
        return true; // No empty cells found, it's a draw
    }

    // Function that clears the board, setting all cells back to their initial state (i.e., empty).
    function resetBoard() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].reset(); // Assuming you add a reset method to Cell too.
            }
        }
    }

    // Return the public methods of the Gameboard
    return {
        printBoard: printBoard,
        placeToken: placeToken,
        checkWin: checkWin,
        checkDraw: checkDraw,
        resetBoard: resetBoard
    };
}

// Define the Cell function, which represents each cell on the game board
function Cell() {
    // Initialize the cell's value as an empty string to indicate it's unoccupied
    let value = "";

    // Function to add a player's token to the cell
    function addToken(player) {
        value = player; // Set the cell's value to the player's token
    }

    // Function to get the cell's current value
    function getValue() {
        return value; // Return the cell's value
    }

    function reset() {
        value = ""; // Reset the cell's value to empty
    }

    // Return the public methods of the Cell
    return {
        addToken: addToken,
        getValue: getValue,
        reset: reset
    };
}

// Define the GameController function, which manages the game logic and player turns
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // Initialize the game board
    var board = Gameboard();
    // Define the players with their names and tokens
    var players = [
        { name: playerOneName, token: "X" },
        { name: playerTwoName, token: "O" }
    ];

    // Set the first player as the active player
    var activePlayer = players[0];

    // Function to switch the active player after each turn
    function switchPlayerTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    // Function to get the current active player
    function getActivePlayer() {
        return activePlayer;
    }

    // Function to print the new round's information
    function printNewRound() {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    // Function to play a round by placing a token and checking for a win
    function playRound(row, column) {
        console.log(`Placing ${getActivePlayer().name}'s token at row ${row}, column ${column}...`);
        // Place the token on the board
        board.placeToken(row, column, getActivePlayer().token);

        // Check for a win after placing the token
        if (board.checkWin()) {
            console.log(`${getActivePlayer().name} wins!`);
            board.printBoard();
            resetGame();
            return; // Stop further execution to prevent switching turns after a win
        } else if (board.checkDraw()) { // Check for a draw
            console.log("Game is a draw!");
            board.printBoard();
            resetGame();
            return; // Stop further execution after a draw
        }

        // Switch to the next player's turn if no win or draw is detected
        switchPlayerTurn();
        printNewRound();
    }

    //reset game
    function resetGame() {
        board.resetBoard(); // Reset the game board
        activePlayer = players[0]; // Reset the active player to the first player
        console.log("Game has been reset. Starting a new game...");
        printNewRound(); // Print the new round's information
    }

    // Print the initial round information
    printNewRound();

    // Return the public methods of the GameController
    return {
        playRound: playRound,
        getActivePlayer: getActivePlayer,
        resetGame: resetGame
    };
}

// Initialize the game and start playing
const game = GameController();