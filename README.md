# Chess Game

A browser-based chess game for two people sharing one device. Play White and Black in turn on the same board, with legal-move feedback and game status shown as you play.

## Features

- Hot-seat, two-player games with no account or server required.
- Highlights available moves when you select a piece.
- Handles captures, check, and moves that would leave your own king in check.
- Supports castling, en passant, and pawn promotion (choose a queen, rook, bishop, or knight).
- Detects checkmate and stalemate, and displays the winner or draw.
- Shows captured pieces and whose turn it is.
- Responsive board styling with light and dark color-scheme support.

This is a focused chess game rather than a full tournament platform: it has no online play, clocks, saved games, or draw rules beyond stalemate.

## Getting started

### Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

### Install and run

```sh
git clone https://github.com/vobradovic17/chess-game.git
cd chess-game
npm ci
npm run dev
```

Open the local address printed by Vite in your browser. The game starts with White to move. Select one of your pieces to see its available destinations, then select a highlighted square to move. Select the same piece again to deselect it, or select another piece of your color to switch selection. If a pawn reaches the opposite end of the board, choose what piece it promotes to.

The game runs locally in the browser; reloading the page starts a new game.

### Available commands

```sh
npm run dev      # Start the Vite development server with hot reload
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

There is currently no automated test runner configured.

## Project structure

- `src/App.jsx` — page layout and player panels.
- `src/components/ChessBoard.jsx` — board rendering, click handling, and promotion selection.
- `src/components/PlayerInfo.jsx` — turn, check, result, and captured-piece display.
- `src/store/index.js` — Redux store, move rules, check detection, and game-ending logic.
- `src/utils/index.js` — board setup and file names (A–H).
- `src/assets/` — chess-piece SVG artwork.

The app is built with React 19 and Redux 5, and uses Vite for development and production builds.

## Help

For project questions or bug reports, [open an issue](https://github.com/vobradovic17/chess-game/issues). For tools used by the project, see the [Vite guide](https://vite.dev/guide/) and [React documentation](https://react.dev/learn).

## Maintainers and contributing

No individual maintainer or separate contribution guide is listed in this repository. Contributions are welcome: open an issue to discuss a larger change, then submit a pull request with a concise description of the change.

Before submitting a pull request, run:

```sh
npm run lint
npm run build
```

Keep changes focused and include any relevant updates to the README.
