import { createStore } from "redux";

import { createChessBoard, columns } from "../utils";

const initialState = {
  chessBoard: createChessBoard(),
  gameControls: {
    turn: "white",
    nextMove: true,
    lastMove: null,
  },
  players: {
    white: {
      color: "white",
      underCheck: false,
      pieceSelected: false,
      squareSelected: null,
      piecesTaken: [],
    },
    black: {
      color: "black",
      underCheck: false,
      pieceSelected: false,
      squareSelected: null,
      piecesTaken: [],
    },
  },
};

const reducer = (state = initialState, action) => {
  // action.type -> type of action. passed in from dispatch function from component
  // action.payload -> can be used to access payload data passed in from component via actions

  const newState = { ...state };

  if (action.type == "SELECT_PIECE") {
    let row = action.payload.arrayRow;
    let column = action.payload.arrayColumn;

    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    newState.chessBoard[row][column].isCurrentSquare = true;
  }

  if (action.type == "UNSELECT_PIECE") {
    let row = action.payload.arrayRow;
    let column = action.payload.arrayColumn;
    let onTurn = newState.gameControls.turn;

    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    newState.players[onTurn] = {
      ...newState.players[onTurn],
      squareSelected: false,
      pieceSelected: false,
    };

    newState.chessBoard[row][column].isCurrentSquare = false;

    newState.chessBoard.flat().forEach((square) => {
      square.isTargetSquare = false;
    });

    return newState;
  }

  if (action.type == "SELECT_OTHER_PIECE") {
    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    newState.chessBoard.flat().forEach((square) => {
      square.isCurrentSquare = false;
      square.isTargetSquare = false;
    });
  }

  if (action.type == "SET_PLAYER_DATA") {
    let player = action.payload.player;

    newState.players[player] = {
      ...newState.players[player],
      squareSelected: action.payload.squareSelected,
      pieceSelected: action.payload.pieceSelected,
    };
  }

  if (action.type == "CHECK_MOVE_AVAILABILITY") {
    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    let onTurn = action.payload.player;
    newState.players[onTurn] = { ...newState.players[onTurn] };

    const chessBoard = newState.chessBoard;

    // check all squares and mark those to which can be moved by setting property isTargetSquare to true
    let arrayRow = 8 - action.payload.square.row;
    let arrayColumn = columns.findIndex(
      (item) => item == action.payload.square.column,
    );

    let piece = action.payload.square.piece.piece;
    let color = action.payload.square.piece.color;
    let isWhitePlayer = color == "white";

    // set movements for every piece by piece
    if (piece == "pawn") {
      let pawnOnStartingField = isWhitePlayer
        ? action.payload.square.row == 2
        : action.payload.square.row == 7;
      let rowForward = isWhitePlayer ? arrayRow - 1 : arrayRow + 1;
      let twoRowsForward = isWhitePlayer ? arrayRow - 2 : arrayRow + 2;
      let columnForwardLeft = isWhitePlayer ? arrayColumn - 1 : arrayColumn + 1;
      let columnForwardRight = isWhitePlayer
        ? arrayColumn + 1
        : arrayColumn - 1;

      let oneSquareForward = !chessBoard[rowForward][arrayColumn].isOccupied;

      let twoSquaresForward =
        pawnOnStartingField &&
        oneSquareForward &&
        !chessBoard[twoRowsForward][arrayColumn].isOccupied;

      let leftSideAttack =
        chessBoard[rowForward][columnForwardLeft]?.isOccupied &&
        chessBoard[rowForward][columnForwardLeft]?.occupiedByPlayer !=
          action.payload.player;
          
      let rightSideAttack =
        chessBoard[rowForward][columnForwardRight]?.isOccupied &&
        chessBoard[rowForward][columnForwardRight]?.occupiedByPlayer !=
          action.payload.player;

      if (oneSquareForward) {
        chessBoard[rowForward][arrayColumn].isTargetSquare = true;
      }

      if (twoSquaresForward) {
        chessBoard[twoRowsForward][arrayColumn].isTargetSquare = true;
      }

      if (leftSideAttack) {
        chessBoard[rowForward][columnForwardLeft].isTargetSquare = true;
      }

      if (rightSideAttack) {
        chessBoard[rowForward][columnForwardRight].isTargetSquare = true;
      }
    }

    if (piece == "knight") {
      let arrayRow = 8 - action.payload.square.row;
      let arrayColumn = columns.findIndex(
        (item) => item == action.payload.square.column,
      );

      let moveOptions = [
        [-2, -1],
        [-2, 1],
        [-1, 2],
        [1, 2],
        [2, -1],
        [2, 1],
        [-1, -2],
        [1, -2],
      ];

      moveOptions.forEach((option) => {
        let rowForward = arrayRow + option[0];
        let columnForward = arrayColumn + option[1];
        if (chessBoard[rowForward] && chessBoard[rowForward][columnForward]) {
          if (
            !chessBoard[rowForward][columnForward]?.isOccupied ||
            chessBoard[rowForward][columnForward]?.occupiedByPlayer !=
              action.payload.player
          ) {
            chessBoard[rowForward][columnForward].isTargetSquare = true;
          }
        }
      });
    }

    if (piece == "bishop") {
      let arrayRow = 8 - action.payload.square.row;
      let arrayColumn = columns.findIndex(
        (item) => item == action.payload.square.column,
      );

      let moveOptions = [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
      ];

      moveOptions.forEach((option) => {
        let rowForward = arrayRow + option[0];
        let columnForward = arrayColumn + option[1];

        while (
          chessBoard[rowForward] &&
          chessBoard[rowForward][columnForward]
        ) {
          const targetSquare = chessBoard[rowForward][columnForward];

          if (targetSquare.isOccupied) {
            if (targetSquare.occupiedByPlayer != action.payload.player) {
              targetSquare.isTargetSquare = true;
            }
            break;
          }

          targetSquare.isTargetSquare = true;
          rowForward += option[0];
          columnForward += option[1];
        }
      });
    }

    if (piece == "rook") {
      let arrayRow = 8 - action.payload.square.row;
      let arrayColumn = columns.findIndex(
        (item) => item == action.payload.square.column,
      );

      let moveOptions = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ];

      moveOptions.forEach((option) => {
        let rowForward = arrayRow + option[0];
        let columnForward = arrayColumn + option[1];

        while (
          chessBoard[rowForward] &&
          chessBoard[rowForward][columnForward]
        ) {
          const targetSquare = chessBoard[rowForward][columnForward];

          if (targetSquare.isOccupied) {
            if (targetSquare.occupiedByPlayer != action.payload.player) {
              targetSquare.isTargetSquare = true;
            }
            break;
          }

          targetSquare.isTargetSquare = true;
          rowForward += option[0];
          columnForward += option[1];
        }
      });
    }

    if (piece == "queen") {
      let arrayRow = 8 - action.payload.square.row;
      let arrayColumn = columns.findIndex(
        (item) => item == action.payload.square.column,
      );

      let moveOptions = [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ];

      moveOptions.forEach((option) => {
        let rowForward = arrayRow + option[0];
        let columnForward = arrayColumn + option[1];

        while (
          chessBoard[rowForward] &&
          chessBoard[rowForward][columnForward]
        ) {
          const targetSquare = chessBoard[rowForward][columnForward];

          if (targetSquare.isOccupied) {
            if (targetSquare.occupiedByPlayer != action.payload.player) {
              targetSquare.isTargetSquare = true;
            }
            break;
          }

          targetSquare.isTargetSquare = true;
          rowForward += option[0];
          columnForward += option[1];
        }
      });
    }

    if (piece == "king") {
      let arrayRow = 8 - action.payload.square.row;
      let arrayColumn = columns.findIndex(
        (item) => item == action.payload.square.column,
      );

      let moveOptions = [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ];

      moveOptions.forEach((option) => {
        let rowForward = arrayRow + option[0];
        let columnForward = arrayColumn + option[1];

        if (chessBoard[rowForward] && chessBoard[rowForward][columnForward]) {
          const targetSquare = chessBoard[rowForward][columnForward];

          if (
            !targetSquare.isOccupied ||
            targetSquare.occupiedByPlayer != action.payload.player
          ) {
            targetSquare.isTargetSquare = true;
          }
        }
      });
    }
    return newState;
  }

  if (action.type == "MOVE_PIECE") {
    let onTurn = action.payload.player;

    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    newState.players[onTurn] = { ...newState.players[onTurn] };

    newState.gameControls.lastMove = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    let oldSquare = newState.chessBoard.flat().find((item) => {
      return item.square == newState.players[onTurn].squareSelected;
    });

    let piece = oldSquare.piece;

    oldSquare.piece = null;
    oldSquare.isOccupied = false;
    oldSquare.occupiedByPlayer = null;
    oldSquare.occupiedByFigure = null;
    oldSquare.isCurrentSquare = false;

    let newSquare = newState.chessBoard.flat().find((item) => {
      return item.square == action.payload.square.square;
    });

    if (newSquare.isOccupied) {
      newState.players[onTurn].piecesTaken.push(newSquare.piece);
    }

    newSquare.piece = piece;
    newSquare.isOccupied = true;
    newSquare.occupiedByPlayer = piece.color;
    newSquare.occupiedByFigure = piece.piece;
  }

  // logic for checking if own king in under check
  if (action.type == "CHECK_OWN_CHECK") {
    const currentPlayer = action.payload.player;
    const opponentPlayer = currentPlayer === "white" ? "black" : "white";

    const getSquare = (arrayRow, arrayColumn) => {
      if (arrayRow < 0 || arrayRow > 7 || arrayColumn < 0 || arrayColumn > 7) {
        return null;
      }

      return newState.chessBoard[arrayRow][arrayColumn];
    };

    const isSquareAttacked = (row, column, attackingPlayer) => {
      let isUnderCheck = false;

      const arrayRow = 8 - row;
      const arrayColumn = columns.findIndex((item) => item == column);
      const direction = attackingPlayer === "white" ? 1 : -1;

      const pawnAttackRow = arrayRow + direction;
      const pawnAttackColumns = [arrayColumn - 1, arrayColumn + 1];

      pawnAttackColumns.forEach((pawnTargetColumn) => {
        const candidateSquare = getSquare(pawnAttackRow, pawnTargetColumn);

        if (
          candidateSquare?.isOccupied &&
          candidateSquare.occupiedByPlayer === attackingPlayer &&
          candidateSquare.piece?.piece === "pawn"
        ) {
          isUnderCheck = true;
        }
      });

      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, 2],
        [1, 2],
        [2, -1],
        [2, 1],
        [-1, -2],
        [1, -2],
      ];
      knightMoves.forEach((moveOption) => {
        const attackRow = arrayRow + moveOption[0];
        const attackColumn = arrayColumn + moveOption[1];
        const candidateSquare = getSquare(attackRow, attackColumn);

        if (
          candidateSquare?.isOccupied &&
          candidateSquare.occupiedByPlayer === attackingPlayer &&
          candidateSquare.piece?.piece === "knight"
        ) {
          isUnderCheck = true;
        }
      });

      const bishopMoves = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
      bishopMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "bishop"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      const rookMoves = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      rookMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "rook"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      const queenMoves = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      queenMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "queen"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      const kingMoves = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      kingMoves.forEach((moveOption) => {
        const attackRow = arrayRow + moveOption[0];
        const attackColumn = arrayColumn + moveOption[1];
        const candidateSquare = getSquare(attackRow, attackColumn);

        if (
          candidateSquare?.isOccupied &&
          candidateSquare.occupiedByPlayer === attackingPlayer &&
          candidateSquare.piece?.piece === "king"
        ) {
          isUnderCheck = true;
        }
      });

      return isUnderCheck;
    };

    const kingSquare = newState.chessBoard.flat().find((square) => {
      return (
        square.isOccupied &&
        square.occupiedByPlayer === currentPlayer &&
        square.piece?.piece === "king"
      );
    });

    const isUnderCheck = kingSquare
      ? isSquareAttacked(kingSquare.row, kingSquare.column, opponentPlayer)
      : false;

    if (isUnderCheck) {
      newState.chessBoard = newState.gameControls.lastMove.map((item) => {
        return [...item].map((subitem) => {
          return { ...subitem };
        });
      });

      let onTurn = action.payload.player;

      newState.players[onTurn] = {
        ...newState.players[onTurn],
        squareSelected: false,
        pieceSelected: false,
      };

      newState.gameControls = {
        ...newState.gameControls,
        nextMove: false,
      };

      newState.chessBoard.flat().forEach((square) => {
        square.isTargetSquare = false;
        square.isCurrentSquare = false;
      });

      return newState;
    } else {
      newState.players[currentPlayer] = {
        ...newState.players[currentPlayer],
        underCheck: isUnderCheck,
      };
    }
  }

  if (action.type == "CHECK_OPPONENT_CHECK") {
    const opponentPlayer =
      action.payload.player === "white" ? "black" : "white";

    const getSquare = (arrayRow, arrayColumn) => {
      if (arrayRow < 0 || arrayRow > 7 || arrayColumn < 0 || arrayColumn > 7) {
        return null;
      }

      return newState.chessBoard[arrayRow][arrayColumn];
    };

    const isSquareAttacked = (row, column, attackingPlayer) => {
      let isUnderCheck = false;

      const arrayRow = 8 - row;
      const arrayColumn = columns.findIndex((item) => item == column);

      const direction = attackingPlayer === "white" ? 1 : -1;

      const pawnAttackRow = arrayRow + direction;
      const pawnAttackColumns = [arrayColumn - 1, arrayColumn + 1];

      pawnAttackColumns.forEach((pawnTargetColumn) => {
        const candidateSquare = getSquare(pawnAttackRow, pawnTargetColumn);

        if (
          candidateSquare?.isOccupied &&
          candidateSquare.occupiedByPlayer === attackingPlayer &&
          candidateSquare.piece?.piece === "pawn"
        ) {
          isUnderCheck = true;
        }
      });

      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, 2],
        [1, 2],
        [2, -1],
        [2, 1],
        [-1, -2],
        [1, -2],
      ];

      knightMoves.forEach((moveOption) => {
        const attackRow = arrayRow + moveOption[0];
        const attackColumn = arrayColumn + moveOption[1];

        const candidateSquare = getSquare(attackRow, attackColumn);

        if (
          candidateSquare?.isOccupied &&
          candidateSquare.occupiedByPlayer === attackingPlayer &&
          candidateSquare.piece?.piece === "knight"
        ) {
          isUnderCheck = true;
        }
      });

      const bishopMoves = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];

      bishopMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare?.isOccupied &&
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "bishop"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      const rookMoves = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      rookMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare?.isOccupied &&
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "rook"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      const queenMoves = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

      queenMoves.forEach((moveOption) => {
        let attackRow = arrayRow + moveOption[0];
        let attackColumn = arrayColumn + moveOption[1];

        while (
          attackRow >= 0 &&
          attackRow <= 7 &&
          attackColumn >= 0 &&
          attackColumn <= 7
        ) {
          const candidateSquare = getSquare(attackRow, attackColumn);

          if (!candidateSquare || !candidateSquare.isOccupied) {
            attackRow += moveOption[0];
            attackColumn += moveOption[1];
            continue;
          }

          if (
            candidateSquare?.isOccupied &&
            candidateSquare.occupiedByPlayer === attackingPlayer &&
            candidateSquare.piece?.piece === "queen"
          ) {
            isUnderCheck = true;
          }

          break;
        }
      });

      return isUnderCheck;
    };

    // find square where opponent king is placed
    const kingSquare = newState.chessBoard.flat().find((square) => {
      return (
        square.isOccupied &&
        square.occupiedByPlayer === opponentPlayer &&
        square.piece?.piece === "king"
      );
    });

    // check if opponents king square is attacked
    const isUnderCheck = kingSquare
      ? isSquareAttacked(
          kingSquare.row,
          kingSquare.column,
          action.payload.player,
        )
      : false;

    newState.players[opponentPlayer] = {
      ...newState.players[opponentPlayer],
      underCheck: isUnderCheck,
    };
  }

  if (action.type == "END_MOVE") {
    newState.gameControls = { ...newState.gameControls };

    if (!newState.gameControls.nextMove) {
      newState.gameControls.nextMove = true;
      return newState;
    }

    let player = action.payload.player;

    newState.players[player] = {
      ...newState.players[player],
      squareSelected: false,
      pieceSelected: false,
    };

    let turns = ["white", "black"];
    newState.gameControls.turn = turns.find((item) => {
      return item != newState.gameControls.turn;
    });

    newState.chessBoard = newState.chessBoard.map((item) => {
      return [...item].map((subitem) => {
        return { ...subitem };
      });
    });

    newState.chessBoard.flat().forEach((square) => {
      square.isTargetSquare = false;
    });

    return newState;
  }

  return newState;
};

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
