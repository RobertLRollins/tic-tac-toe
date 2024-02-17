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
            if (board[a[0]][a[1]].getValue() && board[a[0]][a[1]].getValue() === board[b[0]][b[1]].getValue() && board[a[0]][a[1]].getValue() === board[c[0]][c[1]].getValue()) {
                return combo; // Return the winning combination instead of just true
            }
        }
        return null; // Return null instead of false to indicate no win

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
    // Tracks if the game has ended
    let gameEnded = false;

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
        const moveValid = board.placeToken(row, column, getActivePlayer().token);

        if (moveValid) {
            const winningCombo = board.checkWin(); // This now returns the winning combination or null
            if (winningCombo) {
                const winMessage = `${getActivePlayer().name} wins!`;
                console.log(winMessage);
                board.printBoard();
                gameEnded = true;
                return { gameEnded, message: winMessage, winningCombo }; // Include winningCombo in the return
            } else if (board.checkDraw()) {
                const drawMessage = "Game is a draw!";
                console.log(drawMessage);
                board.printBoard();
                gameEnded = true;
                return { gameEnded, message: drawMessage, winningCombo: null }; // No winningCombo in case of a draw
            }
            switchPlayerTurn();
        }
        // If the game continues without a win or draw
        return { gameEnded: false, message: `${getActivePlayer().name}'s turn.`, winningCombo: null };
    };


    //reset game
    const resetGame = () => {
        board.resetBoard(); // Reset the game board
        activePlayer = players[0]; // Reset the active player to the first player
        gameEnded = false; // Reset the gameEnded flag
        console.log("Game has been reset. Starting a new game...");
        printNewRound(); // Print the new round's information
    }

    // Method to check if the game has ended
    const isGameEnded = () => gameEnded;
    // Print the initial round information
    printNewRound();

    // Return the public methods of the GameController
    return {
        playRound,
        getActivePlayer,
        resetGame,
        getBoard: board.getBoard,
        isGameEnded
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resetButtonDiv = document.querySelector('.resetButton'); // Select the div for the reset button

    // Tracking the state of each cell (GIF or PNG)
    let cellState = Array.from(Array(3), () => new Array(3).fill(false));
    let isWaiting = false; // Track if waiting for an animation to complete

    // Function to initialize the reset button
    const initializeResetButton = () => {
        resetButtonDiv.innerHTML = ''; // Clear the div content
        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset Game";
        resetButton.addEventListener("click", resetHandler);
        resetButtonDiv.appendChild(resetButton);
    }

    // Handler for resetting the game
    const resetHandler = () => {
        game.resetGame();
        cellState = Array.from(Array(3), () => new Array(3).fill(false)); // Reset cell states
        updateScreen(); // Update the screen after resetting
    }

    const updateScreen = (gameEnded = false, winningCombo = null) => {
        boardDiv.textContent = ""; // Clear the board

        const board = game.getBoard();

        // Paths to your images and GIFs
        const imagePathX = 'X.png';
        const imagePathO = 'O.png';
        const gifPathX = 'X.gif';
        const gifPathO = 'O.gif';
        const winningGifPaths = [
            'H1.gif', 'H2.gif', 'H3.gif', 'V1.gif',
            'V2.gif', 'V3.gif', 'D1.gif', 'D2.gif'
        ];

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                const cellValue = cell.getValue();
                if (cellValue) {
                    const cellImage = document.createElement("img");
                    const alreadyConvertedToPNG = cellState[rowIndex][columnIndex];

                    if (!alreadyConvertedToPNG) {
                        cellImage.src = cellValue === "X" ? gifPathX : gifPathO;
                        isWaiting = true; // Set waiting state before starting the animation
                        setTimeout(() => {
                            cellImage.src = cellValue === "X" ? imagePathX : imagePathO;
                            cellState[rowIndex][columnIndex] = true;
                            isWaiting = false; // Reset waiting state after animation completes
                            // Display winning GIF overlay if there's a winning combination
                            if (gameEnded && winningCombo) {
                                const winningIndex = determineWinningIndex(winningCombo);
                                if (winningIndex !== -1) {
                                    const winningGifPath = winningGifPaths[winningIndex];
                                    const gifOverlay = document.createElement("img");
                                    gifOverlay.src = winningGifPath;
                                    gifOverlay.style.position = 'absolute';
                                    gifOverlay.style.top = '0';
                                    gifOverlay.style.left = '0';
                                    gifOverlay.style.width = '100%';
                                    gifOverlay.style.height = '100%';
                                    gifOverlay.classList.add("winning-overlay");
                                    boardDiv.style.position = 'relative';
                                    boardDiv.appendChild(gifOverlay);
                                }
                            }
                        }, 1500); // Adjust timing as needed
                    } else {
                        cellImage.src = cellValue === "X" ? imagePathX : imagePathO;
                    }
                    cellButton.appendChild(cellImage);
                }

                boardDiv.appendChild(cellButton);
            });
        });

        if (!gameEnded) {
            playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn`;
        }
    };

    // Helper function to determine the index of the winning combination
    function determineWinningIndex(winningCombo) {
        // Assuming you have a predefined set of winning combinations in the Gameboard
        const winningCombinations = [
            [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], // Rows
            [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], // Columns
            [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]] // Diagonals
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            if (JSON.stringify(winningCombinations[i]) === JSON.stringify(winningCombo)) {
                return i; // Return the index of the matching winning combination
            }
        }
        return -1; // In case no match is found
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        console.log(game.isGameEnded());
        if (isWaiting || game.isGameEnded()) {
            console.log("No further moves allowed. Please reset the game.");
            return;
        }

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow === undefined || selectedColumn === undefined) return;

        const result = game.playRound(parseInt(selectedRow, 10), parseInt(selectedColumn, 10));

        if (result.gameEnded) {
            playerTurnDiv.textContent = result.message; // Display the winner or draw message
            updateScreen(true, result.winningCombo); // Update the screen with the flag that game has ended
        } else {
            updateScreen(); // Update the screen normally
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initialize and show the reset button as soon as the screen controller loads
    initializeResetButton();

    // Initial render
    updateScreen();
}

ScreenController();