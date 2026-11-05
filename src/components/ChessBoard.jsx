import { useSelector, useDispatch } from "react-redux";

import { columns } from "../utils";

export default function ChessBoard() {
  const chessBoard = useSelector((state) => {
    return state.chessBoard;
  });
  const turn = useSelector((state) => {
    return state.gameControls.turn;
  });
  const playerOnTurn = useSelector((state) => {
    return state.players[turn];
  });

  const dispatch = useDispatch();

  function handleMove(row, column) {
    // get clicked square from the chessboard
    const square = chessBoard.flat().find((square) => {
      return square.row === row && square.column === column;
    });

    // row and column values that match chessboard array index values
    const arrayRow = 8 - row;
    const arrayColumn = columns.findIndex((item) => item == column);

    let pieceSelected = playerOnTurn.pieceSelected;
    let isOwnSquare = square.occupiedByPlayer == turn;
    let isCurrentSquare = square.isCurrentSquare;
    let isTargetSquare = square.isTargetSquare;

    // if piece is not selected
    if (!pieceSelected && isOwnSquare) {
      dispatch({
        type: "SELECT_PIECE",
        payload: { arrayRow, arrayColumn },
      });

      dispatch({
        type: "SET_PLAYER_DATA",
        payload: {
          player: turn,
          squareSelected: square.square,
          pieceSelected: true,
        },
      });

      dispatch({
        type: "CHECK_MOVE_AVAILABILITY",
        payload: { player: turn, square: square },
      });
    }

    // if piece is selected and same square is clicked
    if (pieceSelected && isCurrentSquare) {
      dispatch({
        type: "UNSELECT_PIECE",
        payload: { arrayRow, arrayColumn },
      });
    }

    // if piece is selected but player clicks on another piece
    if (pieceSelected && isOwnSquare && !isCurrentSquare) {
      dispatch({ type: "SELECT_OTHER_PIECE" });

      dispatch({
        type: "SELECT_PIECE",
        payload: { arrayRow, arrayColumn },
      });

      dispatch({
        type: "SET_PLAYER_DATA",
        payload: {
          player: turn,
          squareSelected: square.square,
          pieceSelected: true,
        },
      });

      dispatch({
        type: "CHECK_MOVE_AVAILABILITY",
        payload: { player: turn, square: square },
      });
    }

    // if piece is selected and player clicks on a square available for move
    if (pieceSelected && isTargetSquare) {
      dispatch({
        type: "MOVE_PIECE",
        payload: { player: turn, square: square },
      });

      dispatch({
        type: "CHECK_OWN_CHECK",
        payload: { player: turn, square: square },
      });

      dispatch({
        type: "CHECK_OPPONENT_CHECK",
        payload: { player: turn, square: square },
      });

      dispatch({ type: "END_MOVE", payload: { player: turn, playerOnTurn } });
    }
  }

  const files = columns.map((column) => <span key={column}>{column}</span>);
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
    <span key={rank}>{rank}</span>
  ));

  return (
    <div className="board-frame">
      <div className="board-frame__files board-frame__files--top">{files}</div>
      <div className="board-frame__ranks board-frame__ranks--left">{ranks}</div>
      <div className="chess-board">
        {chessBoard.flat().map((square) => (
          <div
            key={square.square}
            className={`chess-board__square ${square.piece ? `${square.piece.color.toLowerCase()}-${square.piece.piece.toLowerCase()}` : ""} ${square.isCurrentSquare ? "back-red" : ""} ${square.isTargetSquare ? "back-green" : ""}`}
            data-row={square.row}
            data-column={square.column}
            onClick={() => handleMove(square.row, square.column)}
          ></div>
        ))}
      </div>
      <div className="board-frame__ranks board-frame__ranks--right">
        {ranks}
      </div>
      <div className="board-frame__files board-frame__files--bottom">
        {files}
      </div>
    </div>
  );
}
