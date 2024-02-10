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
    const printBoard = () => {
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
    const placeToken = (row, column, player) => {
        // Check if the specified location is within the bounds of the board
        if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
            console.log("Invalid cell. Please choose a valid row and column.");
            return false; // Indicate the placement was not successful
        }

        // Access the specified cell
        const cell = board[row][column];

        // Check if the cell is already occupied
        if (cell.getValue() !== "") {
            console.log("This cell is already occupied. Please choose another cell.");
            return false; // Indicate the placement was not successful
        }

        // If the cell is not occupied, place the player's token in the cell
        cell.addToken(player);
        return true; // Indicate the placement was successful
    }

    // Function to check if there is a win condition on the board
    const checkWin = () => {
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
    const checkDraw = () => {
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
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].reset(); // Assuming you add a reset method to Cell too.
            }
        }
    }

    const getBoard = () => board;

    // Return the public methods of the Gameboard
    return {
        printBoard: printBoard,
        placeToken: placeToken,
        checkWin: checkWin,
        checkDraw: checkDraw,
        resetBoard: resetBoard,
        getBoard: getBoard
    };
}

// Define the Cell function, which represents each cell on the game board
function Cell() {
    // Initialize the cell's value as an empty string to indicate it's unoccupied
    let value = "";

    // Function to add a player's token to the cell
    const addToken = (player) => {
        value = player; // Set the cell's value to the player's token
    }

    // Function to get the cell's current value
    const getValue = () => value; // Return the cell's value


    const reset = () => value = ""; // Reset the cell's value to empty

    // Return the public methods of the Cell
    return {
        addToken,
        getValue,
        reset
    };
}

// Define the GameController function, which manages the game logic and player turns
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // Initialize the game board
    const board = Gameboard();
    // Define the players with their names and tokens
    const players = [
        { name: playerOneName, token: "X" },
        { name: playerTwoName, token: "O" }
    ];

    // Set the first player as the active player
    let activePlayer = players[0];

    // Function to switch the active player after each turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Function to get the current active player
    const getActivePlayer = () => activePlayer;

    // Function to print the new round's information
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    // Function to play a round by placing a token and checking for a win
    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer().name}'s token at row ${row}, column ${column}...`);
        // Attempt to place the token on the board and check if the move was valid
        const moveValid = board.placeToken(row, column, getActivePlayer().token);

        if (moveValid) {
            // If the move was valid, check for a win or draw
            if (board.checkWin()) {
                console.log(`${getActivePlayer().name} wins!`);
                board.printBoard();
                resetGame();
                return; // Exit the function after a win
            } else if (board.checkDraw()) {
                console.log("Game is a draw!");
                board.printBoard();
                resetGame();
                return; // Exit the function after a draw
            }

            // If there's no win or draw, switch to the next player
            switchPlayerTurn();
        }

        printNewRound(); // Print the new round's information whether the move was valid or not
    }

    //reset game
    const resetGame = () => {
        board.resetBoard(); // Reset the game board
        activePlayer = players[0]; // Reset the active player to the first player
        console.log("Game has been reset. Starting a new game...");
        printNewRound(); // Print the new round's information
    }

    // Print the initial round information
    printNewRound();

    // Return the public methods of the GameController
    return {
        playRound,
        getActivePlayer,
        resetGame,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Assign row and column data attributes
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        // Ensure both row and column are identified before proceeding
        if (selectedRow === undefined || selectedColumn === undefined) return;

        // Convert to numbers as dataset properties are strings
        game.playRound(parseInt(selectedRow, 10), parseInt(selectedColumn, 10));
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();
