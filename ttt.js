function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    function printBoard() {
        let boardWithCellValues = [];
        for (let i = 0; i < board.length; i++) {
            let rowValues = [];
            for (let j = 0; j < board[i].length; j++) {
                rowValues.push(board[i][j].getValue());
            }
            boardWithCellValues.push(rowValues);
        }
        console.log(boardWithCellValues);
    }

    function placeToken(row, column, player) {

        if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
            console.log("Invalid cell. Please choose a valid row and column.");
            return;
        }


        const cell = board[row][column];


        if (cell.getValue() !== "") {
            console.log("This cell is already occupied. Please choose another cell.");
            return;
        }


        cell.addToken(player);
    }

    return {
        printBoard: printBoard,
        placeToken: placeToken
    };
}

function Cell() {
    let value = "";

    function addToken(player) {
        value = player;
    }

    function getValue() {
        return value;
    }

    return {
        addToken: addToken,
        getValue: getValue
    };
}

function GameController(playerOneName, playerTwoName) {
    playerOneName = playerOneName || "Player One";
    playerTwoName = playerTwoName || "Player Two";

    var board = Gameboard();
    var players = [
        { name: playerOneName, token: "X" },
        { name: playerTwoName, token: "O" }
    ];

    var activePlayer = players[0];

    function switchPlayerTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function printNewRound() {
        board.printBoard();
        console.log(getActivePlayer().name + "'s turn.");
    }

    function playRound(row, column) {
        console.log(`Placing ${getActivePlayer().name}'s token at row ${row}, column ${column}...`);
        board.placeToken(row, column, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        playRound: playRound,
        getActivePlayer: getActivePlayer
    };
}

const game = GameController();