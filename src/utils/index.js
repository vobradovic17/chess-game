export const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const createChessBoard = () => {
  const board = [];

  for (let row = 8; row >= 1; row--) {
    const rowArray = [];
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const backRank = [
        { piece: "rook" },
        { piece: "knight" },
        { piece: "bishop" },
        { piece: "queen" },
        { piece: "king" },
        { piece: "bishop" },
        { piece: "knight" },
        { piece: "rook" },
      ];

      const frontRank = { piece: "pawn" };

      let piece = {};

      if (row === 8) {
        piece.color = "black";
        piece.piece = backRank[colIndex].piece;
        piece.blockedByCheck = false;
      } else if (row === 7) {
        piece.color = "black";
        piece.piece = frontRank.piece;
        piece.blockedByCheck = false;
      } else if (row === 2) {
        piece.color = "white";
        piece.piece = frontRank.piece;
        piece.blockedByCheck = false;
      } else if (row === 1) {
        piece.color = "white";
        piece.piece = backRank[colIndex].piece;
        piece.blockedByCheck = false;
      }

      // used for castling rights
      if (piece.piece) piece.hasMoved = false;

      rowArray.push({
        square: `${columns[colIndex]}${row}`,
        row: row,
        column: columns[colIndex],
        piece: piece.piece ? piece : null,
        isOccupied: piece.piece ? true : false,
        occupiedByPlayer: piece.color || null,
        occupiedByFigure: piece.piece || null,
        isCurrentSquare: false,
        isTargetSquare: false,
      });
    }
    board.push(rowArray);
  }

  return board;
};
