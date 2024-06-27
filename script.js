let board;
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    if (emptyCells.length > 0) {
        let {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = `tile ${board[i][j] !== 0 ? `tile-${board[i][j]}` : ''}`;
            tile.textContent = board[i][j] !== 0 ? board[i][j] : '';
            gameBoard.appendChild(tile);
        }
    }
    document.getElementById('score').textContent = score;
    document.getElementById('best-score').textContent = bestScore;
}

function move(direction) {
    let changed = false;

    const moveAndMerge = (line) => {
        // 0을 제거하고 숫자들만 남김
        let newLine = line.filter(tile => tile !== 0);
        
        // 같은 숫자 합치기
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                newLine.splice(i + 1, 1);
                changed = true;
            }
        }
        
        // 배열 길이를 4로 맞추기 (부족한 부분은 0으로 채움)
        while (newLine.length < 4) {
            newLine.push(0);
        }
        
        return newLine;
    };

    // 보드의 각 행 또는 열에 대해 이동 및 병합 수행
    const moveTiles = (isVertical) => {
        for (let i = 0; i < 4; i++) {
            let line = [];
            
            // 현재 행 또는 열 추출
            for (let j = 0; j < 4; j++) {
                line.push(isVertical ? board[j][i] : board[i][j]);
            }
            
            // 방향에 따라 뒤집기
            if (direction === 'ArrowDown' || direction === 'ArrowRight') {
                line.reverse();
            }
            
            let newLine = moveAndMerge(line);
            
            // 방향에 따라 다시 뒤집기
            if (direction === 'ArrowDown' || direction === 'ArrowRight') {
                newLine.reverse();
            }
            
            // 변경된 라인을 보드에 적용
            for (let j = 0; j < 4; j++) {
                if (isVertical) {
                    if (board[j][i] !== newLine[j]) {
                        changed = true;
                        board[j][i] = newLine[j];
                    }
                } else {
                    if (board[i][j] !== newLine[j]) {
                        changed = true;
                        board[i][j] = newLine[j];
                    }
                }
            }
        }
    };

    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
        moveTiles(true);
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
        moveTiles(false);
    }

    if (changed) {
        addNewTile();
        updateBoard();
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    if (isGameOver()) {
        alert('게임 오버!');
    }
}

function isGameOver() {
    // 빈 칸이 있는지 확인
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
        }
    }

    // 인접한 타일과 합칠 수 있는지 확인
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }

    return true;
}

document.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        move(event.key);
    }
});

initGame();