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

    return {
        printBoard: printBoard
    };
}

function Cell() {
    let value = 0;

    return {
        getValue: function () {
            return value;
        },
    };
}

Gameboard().printBoard(); 