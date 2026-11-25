import { useSelector } from "react-redux";

export default function PlayerInfo({ color }) {
  const player = useSelector((state) => state.players[color]);
  const turn = useSelector((state) => state.gameControls.turn);
  const status = useSelector((state) => state.gameControls.status);
  const isOnTurn = turn === color;
  const isPlaying = status === "playing";
  const isMated = status === "checkmate" && isOnTurn;
  const isWinner = status === "checkmate" && !isOnTurn;

  return (
    <section className={`player-info ${isOnTurn ? "player-info--active" : ""}`}>
      <span
        className={`player-info__swatch player-info__swatch--${color}`}
      ></span>
      <h2 className="player-info__name">
        {color === "white" ? "White" : "Black"}
      </h2>
      {isOnTurn && isPlaying && (
        <span className="player-info__badge">On the move</span>
      )}
      {player.underCheck && (
        <span className="player-info__badge player-info__badge--check">
          {isMated ? "Checkmate" : "Check"}
        </span>
      )}
      {isWinner && <span className="player-info__badge">Winner</span>}
      {status === "stalemate" && (
        <span className="player-info__badge">Stalemate — draw</span>
      )}
      <div className="player-info__taken">
        {player.piecesTaken.map((taken, index) => (
          <span
            key={index}
            className={`player-info__piece ${taken.color}-${taken.piece}`}
            title={`${taken.color} ${taken.piece}`}
          ></span>
        ))}
      </div>
    </section>
  );
}
