# Chess Game

A browser-based, two-player chess game for playing locally on one device. The interface is built with React, and Redux manages the board and game state.

## Features

- Play as White and Black, taking turns on the same board.
- See available destinations when selecting a piece.
- Capture pieces and see captured pieces in each player's panel.
- See whose turn it is and when a king is in check.
- Responsive board layout with light and dark color-scheme support.

This project implements basic piece movement and check handling, but is not a complete implementation of tournament chess rules. Castling, en passant, pawn promotion, checkmate, and stalemate detection are not implemented.

## Getting started

### Requirements

- Node.js and npm (use versions supported by Vite).

### Install and run

```sh
git clone <repository-url>
cd chess-game
npm ci
npm run dev
```

Open the local URL printed by Vite in your browser. To play, select one of the current player's pieces; available destinations are highlighted. Select a highlighted square to move, select the same piece again to deselect it, or select another piece of the same color to switch pieces.

### Other commands

```sh
npm run build    # Build the production site in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Project structure

- [`src/components/ChessBoard.jsx`](src/components/ChessBoard.jsx) renders the board and handles square clicks.
- [`src/components/PlayerInfo.jsx`](src/components/PlayerInfo.jsx) displays each player's turn, check status, and captured pieces.
- [`src/store/index.js`](src/store/index.js) contains the Redux store and game rules.
- [`src/utils/index.js`](src/utils/index.js) creates the initial board.

## Help

For project-specific questions or to report a problem, open an issue in the repository where you obtained this project. For setup or tool questions, see the [Vite documentation](https://vite.dev/guide/) and [React documentation](https://react.dev/learn).

## Maintainers and contributing

No individual maintainer or contribution guide is currently listed in the repository. Contributions are welcome: open an issue to discuss a change, or submit a pull request. Before submitting, run `npm run lint` and `npm run build`.

