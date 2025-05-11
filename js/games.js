const games = [
    {
        id: 'tic-tac-toe',
        title: 'Tic Tac Toe',
        description: 'Classic X and O game for two players',
        players: 2,
        template: `
            <div class="game-container">
                <div class="game-board" id="ticTacToeBoard">
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                    <div class="cell" data-cell></div>
                </div>
                <div class="game-status" id="gameStatus"></div>
                <button id="restartGame">Restart Game</button>
            </div>
        `,
        script: function () {
            const board = document.getElementById('ticTacToeBoard');
            const cells = document.querySelectorAll('[data-cell]');
            const gameStatus = document.getElementById('gameStatus');
            const restartButton = document.getElementById('restartGame');
            let currentPlayer = 'X';
            let gameActive = true;
            let gameState = ['', '', '', '', '', '', '', '', ''];

            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            function handleCellClick(e) {
                const cell = e.target;
                const cellIndex = Array.from(cells).indexOf(cell);

                if (gameState[cellIndex] !== '' || !gameActive) return;

                gameState[cellIndex] = currentPlayer;
                cell.textContent = currentPlayer;
                cell.classList.add(currentPlayer.toLowerCase());

                if (checkWin()) {
                    gameStatus.textContent = `Player ${currentPlayer} wins!`;
                    gameActive = false;
                    updateLeaderboard('tic-tac-toe', currentPlayer);
                    return;
                }

                if (checkDraw()) {
                    gameStatus.textContent = "Game ended in a draw!";
                    gameActive = false;
                    return;
                }

                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            }

            function checkWin() {
                return winningConditions.some(condition => {
                    return condition.every(index => {
                        return gameState[index] === currentPlayer;
                    });
                });
            }

            function checkDraw() {
                return gameState.every(cell => cell !== '');
            }

            function restartGame() {
                currentPlayer = 'X';
                gameActive = true;
                gameState = ['', '', '', '', '', '', '', '', ''];
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o');
                });
            }

            cells.forEach(cell => cell.addEventListener('click', handleCellClick));
            restartButton.addEventListener('click', restartGame);
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        }
    },
    {
        id: 'connect-four',
        title: 'Connect Four',
        description: 'Drop discs to connect four in a row',
        players: 2,
        template: `
            <div class="game-container">
                <div class="game-board" id="connectFourBoard"></div>
                <div class="game-status" id="gameStatus"></div>
                <button id="restartGame">Restart Game</button>
            </div>
        `,
        script: function () {
            // Connect Four game implementation
            const board = document.getElementById('connectFourBoard');
            const gameStatus = document.getElementById('gameStatus');
            const restartButton = document.getElementById('restartGame');
            let currentPlayer = 'red';
            let gameActive = true;
            let gameState = Array(6).fill().map(() => Array(7).fill(''));

            function createBoard() {
                board.innerHTML = '';
                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 7; col++) {
                        const cell = document.createElement('div');
                        cell.classList.add('cell');
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        board.appendChild(cell);
                    }
                }
            }

            function handleCellClick(e) {
                if (!gameActive) return;

                const col = parseInt(e.target.dataset.col);
                const row = findEmptyRow(col);

                if (row === -1) return;

                gameState[row][col] = currentPlayer;
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.classList.add(currentPlayer);

                if (checkWin(row, col)) {
                    gameStatus.textContent = `Player ${currentPlayer} wins!`;
                    gameActive = false;
                    updateLeaderboard('connect-four', currentPlayer);
                    return;
                }

                if (checkDraw()) {
                    gameStatus.textContent = "Game ended in a draw!";
                    gameActive = false;
                    return;
                }

                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            }

            function findEmptyRow(col) {
                for (let row = 5; row >= 0; row--) {
                    if (gameState[row][col] === '') return row;
                }
                return -1;
            }

            function checkWin(row, col) {
                const directions = [
                    [[0, 1], [0, -1]], // Horizontal
                    [[1, 0], [-1, 0]], // Vertical
                    [[1, 1], [-1, -1]], // Diagonal down-right
                    [[1, -1], [-1, 1]] // Diagonal down-left
                ];

                return directions.some(direction => {
                    let count = 1;
                    direction.forEach(([dx, dy]) => {
                        let r = row + dx;
                        let c = col + dy;
                        while (r >= 0 && r < 6 && c >= 0 && c < 7 &&
                            gameState[r][c] === currentPlayer) {
                            count++;
                            r += dx;
                            c += dy;
                        }
                    });
                    return count >= 4;
                });
            }

            function checkDraw() {
                return gameState[0].every(cell => cell !== '');
            }

            function restartGame() {
                currentPlayer = 'red';
                gameActive = true;
                gameState = Array(6).fill().map(() => Array(7).fill(''));
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
                createBoard();
            }

            createBoard();
            board.addEventListener('click', handleCellClick);
            restartButton.addEventListener('click', restartGame);
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        }
    }];