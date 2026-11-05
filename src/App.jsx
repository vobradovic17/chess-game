import ChessBoard from './components/ChessBoard.jsx';
import PlayerInfo from './components/PlayerInfo.jsx';

export default function App() {
  return (
    <>
      <header className="app-header">
        <h1>Chess game</h1>
      </header>
      <main>
        <PlayerInfo color="black" />
        <ChessBoard></ChessBoard>
        <PlayerInfo color="white" />
      </main>
    </>
  );
}
