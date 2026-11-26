# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run preview` — serve the built bundle

There is no test runner configured. `README.md` is the unmodified Vite template.

## Architecture

Two-player, hot-seat chess in React 19 + Redux 5 (plain `createStore`, no Redux Toolkit), JavaScript only.

- `src/main.jsx` wires `<Provider store>` around `App`, which renders `components/ChessBoard.jsx` (board + click handling) and `components/PlayerInfo.jsx` (read-only panel per color: turn badge, check/checkmate badge, winner and stalemate badges, captured pieces).
- `src/utils/index.js` exports `columns` (`A`–`H`) and `createChessBoard()`, which builds the initial 8x8 array of square objects.
- `src/store/index.js` holds all game logic in one reducer (~1100 lines). State: `chessBoard`, `gameControls` (`turn`, `nextMove`, `lastMove`, `piecesStorage`, `status`), and `players.{white,black}` (`underCheck`, `pieceSelected`, `squareSelected`, `piecesTaken`, `enPassant`).

### Things that span files

- **Board indexing:** `chessBoard` is `[arrayRow][arrayColumn]` with row 0 = rank 8. `ChessBoard.jsx` converts a clicked square with `arrayRow = 8 - row` and `arrayColumn = columns.indexOf(column)`, then passes both in action payloads.
- **Click flow is orchestrated in the component, not the reducer.** `handleMove` in `ChessBoard.jsx` decides which actions to dispatch, in sequence. A move dispatches `MOVE_PIECE`, `CHECK_OWN_CHECK`, `CHECK_OPPONENT_CHECK`, then `END_MOVE`. A selection dispatches `SELECT_PIECE`, `SET_PLAYER_DATA`, then `CHECK_MOVE_AVAILABILITY`. The reducer actions depend on this ordering. Clicks are ignored once `gameControls.status` is not `"playing"`.
- **Selection and targets live on the board squares** (`isCurrentSquare`, `isTargetSquare`). `CHECK_MOVE_AVAILABILITY` sets the targets, and the component reads them to render highlights (`back-red`, `back-green`) and to decide whether a click is a move.
- **Piece rendering is CSS-driven.** Each square gets the class `{color}-{piece}` (e.g. `white-knight`). The matching SVGs in `src/assets/` are referenced from `src/App.css` / `src/index.css`.

### Special rules

- **Castling:** pieces carry `hasMoved` (set up in `createChessBoard()`). The king branch of `CHECK_MOVE_AVAILABILITY` offers the two-column move only if the king and rook are unmoved, the squares between them are empty, and the king is not in, passing through or landing in check. `MOVE_PIECE` then moves the rook.
- **En passant:** `players[color].enPassant` (`{ square, pawnSquare }` or `null`) describes that player's own last pawn double step. `MOVE_PIECE` writes the mover's slot on every move, while move generation and capture read only the opponent's. A value left over from an illegal move is never read.
- **Promotion:** `ChessBoard.jsx` keeps the target square in local `promotionSquare` state, shows the piece picker, and passes `promotion` in the `MOVE_PIECE` payload. The reducer defaults to a queen.
- **Checkmate/stalemate:** after switching turns, `END_MOVE` calls `hasLegalMove`, which tries every target through `CHECK_MOVE_AVAILABILITY`, `MOVE_PIECE` and `CHECK_OWN_CHECK` on a `structuredClone` of the state. With no legal move, `status` becomes `"checkmate"` if that player is `underCheck`, otherwise `"stalemate"`. No other draw rules are implemented.

### Reducer conventions and gotchas

- Dispatched action types are string literals matched with `if (action.type == ...)` chains (no `switch`, no action-type constants).
- The reducer copies the board (`map` + spread per square) before mutating it. `players` is mutated through `newState.players[...]` after a shallow copy of `state`, so be careful about accidental shared references.
- Targets can include moves that expose the own king. `CHECK_OWN_CHECK` rejects those after the fact: it restores the board from `lastMove` and the mover's `piecesTaken` from `piecesStorage`, and sets `nextMove: false` so `END_MOVE` keeps the turn. Any new state changed by `MOVE_PIECE` must be undone by this revert or be harmless if left behind. Replace arrays such as `piecesTaken` instead of pushing to them.
- There are three attack checks: the module-level `isSquareAttacked` (takes array indexes; used for castling) and a local function of the same name inside each check handler (takes rank number and column letter). A change to attack rules may need all three.
- Other action types: `UNSELECT_PIECE` and `SELECT_OTHER_PIECE` (deselect / switch selection on a click). `CHECK_OWN_CHECK` and `CHECK_OPPONENT_CHECK` are the largest handlers (~240 and ~200 lines), so most check-related bugs live there.
