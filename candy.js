
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        const boardSize = 8;
        let board = [];
        let selectedCandy = null;

        function createBoard() {
            const gameBoard = document.getElementById('game-board');
            gameBoard.innerHTML = '';
            for (let i = 0; i < boardSize; i++) {
                board[i] = [];
                for (let j = 0; j < boardSize; j++) {
                    const candy = document.createElement('div');
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    candy.style.backgroundColor = randomColor;
                    candy.classList.add('candy');
                    candy.setAttribute('data-row', i);
                    candy.setAttribute('data-col', j);
                    candy.addEventListener('click', handleCandyClick);
                    gameBoard.appendChild(candy);
                    board[i][j] = randomColor;
                }
            }
        }

        function handleCandyClick(event) {
            const candy = event.target;
            const row = parseInt(candy.getAttribute('data-row'));
            const col = parseInt(candy.getAttribute('data-col'));

            if (!selectedCandy) {
                selectedCandy = { row, col, color: candy.style.backgroundColor };
                candy.style.border = '2px solid black';
            } else {
                swapCandies(selectedCandy.row, selectedCandy.col, row, col);
                selectedCandy = null;
            }
        }

        function swapCandies(row1, col1, row2, col2) {
            const tempColor = board[row1][col1];
            board[row1][col1] = board[row2][col2];
            board[row2][col2] = tempColor;
            updateBoardUI();
            setTimeout(checkForMatches, 200);
        }

        function checkForMatches() {
            let matches = [];
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize - 2; j++) {
                    if (board[i][j] && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
                        matches.push([i, j], [i, j + 1], [i, j + 2]);
                    }
                }
            }
            for (let j = 0; j < boardSize; j++) {
                for (let i = 0; i < boardSize - 2; i++) {
                    if (board[i][j] && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
                        matches.push([i, j], [i + 1, j], [i + 2, j]);
                    }
                }
            }
            if (matches.length > 0) {
                removeMatches(matches);
                setTimeout(refillBoard, 500);
            }
        }

        function removeMatches(matches) {
            matches.forEach(([row, col]) => {
                let candy = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if (candy) {
                    candy.classList.add('blast');
                }
            });

            setTimeout(() => {
                matches.forEach(([row, col]) => {
                    board[row][col] = null;
                });
                updateBoardUI();
            }, 300);
        }

        function refillBoard() {
            for (let j = 0; j < boardSize; j++) {
                for (let i = boardSize - 1; i >= 0; i--) {
                    if (!board[i][j]) {
                        for (let k = i; k >= 0; k--) {
                            if (board[k][j]) {
                                board[i][j] = board[k][j];
                                board[k][j] = null;
                                break;
                            }
                        }
                        if (!board[i][j]) {
                            board[i][j] = colors[Math.floor(Math.random() * colors.length)];
                        }
                    }
                }
            }
            updateBoardUI();
            setTimeout(checkForMatches, 500);
        }

        function updateBoardUI() {
            const candies = document.querySelectorAll('.candy');
            candies.forEach(candy => {
                const row = parseInt(candy.getAttribute('data-row'));
                const col = parseInt(candy.getAttribute('data-col'));
                candy.style.backgroundColor = board[row][col] || 'white';
                candy.style.border = '1px solid #ccc';
                candy.classList.remove('blast'); // Remove animation class
            });
        }

        createBoard();