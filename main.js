const gameBoard = (() => {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(createCell());
    }
  }

  const getBoard = () => board;

  const setPosition = (symbol, column, row) => {
    const cell = board[row][column];
  
    if (cell.getValue() === '') {
        cell.addSymbol(symbol); 
        return true;
    } else {
        console.log(`Position (${row}, ${column}) is already occupied.`);
        game.printNewRound();
        return false;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);  
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].addSymbol('');
      }
    }
  };
  
  return { getBoard, setPosition, printBoard, resetBoard };
})();

function createCell() {
  let value = '';

  const addSymbol = (symbol) => {
    value = symbol;
  };

  const getValue = () => value;

  return {
    addSymbol,
    getValue
  };
}

function createPlayer(name, symbol) {
  return {
    name,
    symbol
  };
}

const game = (() => {
  const players = [
    createPlayer('Thiago', 'X'),
    createPlayer('João', 'O')
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column, row) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s symbol into column ${column}...`
    );

    const setPostionStatus = gameBoard.setPosition(getActivePlayer().symbol, column, row);
    
    if (checkWinner()) {
      printWinner();
      displayController.showWinner();
      game.resetGame();
      return;
    }

    if (setPostionStatus) {
      switchPlayerTurn();
      printNewRound();  
    } else {
      return;
    }
  };
  
  const printWinner = () => {
    console.log(`${getActivePlayer().name} wins!`);
    gameBoard.printBoard();
  };

  const checkWinner = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < 3; i++) {
        if (
          (board[i][0].getValue() !== '' &&
            board[i][0].getValue() === board[i][1].getValue() &&
            board[i][1].getValue() === board[i][2].getValue()) ||
          (board[0][i].getValue() !== '' &&
            board[0][i].getValue() === board[1][i].getValue() &&
            board[1][i].getValue() === board[2][i].getValue())
        ) {
          return true;
        }
      }
    
      if (
        (board[0][0].getValue() !== '' &&
          board[0][0].getValue() === board[1][1].getValue() &&
          board[1][1].getValue() === board[2][2].getValue()) ||
        (board[0][2].getValue() !== '' &&
          board[0][2].getValue() === board[1][1].getValue() &&
          board[1][1].getValue() === board[2][0].getValue())
      ) {
        return true;
      }
    
      return false;
  };

  printNewRound();

  const resetGame = () => {
    gameBoard.resetBoard();
    activePlayer = players[0];
    printNewRound();
    displayController.updateScreen();
  };

  return {
    playRound,
    getActivePlayer,
    printNewRound,
    resetGame
  };
})();

const displayController = (() => {
  const playerTurnDiv = document.querySelector('.player-turn');
  const boardContainerDiv = document.querySelector('.board-container');

  const updateScreen = () => {
    boardContainerDiv.textContent = '';

    const board = gameBoard.getBoard();
    
    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;

    board.forEach((row, columnIndex) => {
      row.forEach((cell, rowIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = columnIndex;
        cellButton.dataset.column = rowIndex;
        cellButton.textContent = cell.getValue();
        boardContainerDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    console.log(selectedColumn);
    if (!selectedColumn && !selectedRow) return;

    game.playRound(selectedColumn, selectedRow);
    updateScreen();
  }

  boardContainerDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();

  const showWinner = () => {
    const winnerDiv = document.querySelector('.winner');
    winnerDiv.textContent = `Congrats! The Winner is ${game.getActivePlayer().name}`;
  };
  
  return { showWinner };
})();