const game = (function() {
    let turn = 'X';
    let inProgress = false;
    
    document.querySelectorAll('.box').forEach((box) => { box.addEventListener('click', () => { place(Number(box.id)) }) });

    document.querySelector('#start').addEventListener('click', () => { start() });
    document.querySelector('#reset').addEventListener('click', () => { reset() });

    function nextTurn() {
        turn === 'X' ? turn = 'O': turn = 'X';
        displayController.updateTurn(turn);
    }
    function start() {
        gameboard.reset();
        displayController.resetBoard();
        turn = 'X';
        displayController.updateTurn(turn);
        inProgress = true;
    }
    function place(pos) {
        if (gameboard.canPlace(pos) && inProgress) {
            gameboard.place(pos, turn);
            displayController.place(pos, turn);

            if(gameboard.winCheck())
                win(turn);
            else if(gameboard.drawCheck())
                draw();
            else
                nextTurn();
        }
    }
    function reset() {
        gameboard.reset();
        displayController.resetBoard();
        displayController.reset();
        turn = 'X';
        inProgress = false;
    }
    function win(tick) {
        displayController.win(tick);
        inProgress = false;
    }
    function draw() {
        displayController.draw();
        inProgress = false;
    }

    return { start, place };
})();


const gameboard = (function() {
    let board = new Array(9).fill(null);
    let Xs = [];
    let Os = [];

    const winningArrays = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    function place(pos, tick) {
        board[pos] = tick;
        tick === 'X' ? Xs.push(pos) : Os.push(pos); 
    }
    function canPlace(pos) {
        return (board[pos] === null && !winCheck() && !drawCheck());
    }
    function reset() {
        board = new Array(9).fill(null);
        Xs = [];
        Os = [];
    }
    function winCheck() {
        for (let i = 0; i < winningArrays.length; i++) {
            let xCount = 0;
            let oCount = 0;
    
            for (let j = 0; j < winningArrays[i].length; j++) {
                if (Xs.includes(winningArrays[i][j])) {
                    xCount++;
                }
                if (Os.includes(winningArrays[i][j])) {
                    oCount++;
                }
            }
    
            if (xCount === 3) {
                return 'X';
            }
            if (oCount === 3) {
                return 'O';
            }
        }
        return false;
    }
    function drawCheck() {
        return (!winCheck() && isFilled());  
    }
    function isFilled() {
        return !(board.includes(null));
    }
    function log() {
        console.log(board);
    }

    return {place, reset, winCheck, drawCheck, canPlace, log};
})();


const displayController = (function() {
    let heading = document.querySelector('#heading');
    
    function place(pos, tick) {
        document.getElementById(pos).textContent = tick;
    }
    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            document.getElementById(i).textContent = '';
        }
    }
    function updateTurn(player) {
        heading.textContent = `${player}'s turn`;
    }
    function win(player) {
        heading.textContent = `${player} wins!`;
    }
    function draw() {
        heading.textContent = 'Draw!';
    }
    function reset() {
        heading.textContent = 'Click start to begin!';
    }

    return { place, resetBoard, updateTurn, win, draw, reset };
})();