import React, { useState } from "react";

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  const handleClick = (index) => {
    if (squares[index] || winner) return;
    const next = [...squares];
    next[index] = isX ? "X" : "O";
    setSquares(next);
    setIsX(!isX);
  };

  const restart = () => {
    setSquares(Array(9).fill(null));
    setIsX(true);
  };

  let status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a Draw!"
    : `Next Player: ${isX ? "X" : "O"}`;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Tic Tac Toe</h1>
      <div style={styles.status}>{status}</div>
      <div style={styles.board}>
        {squares.map((val, idx) => (
          <button key={idx} style={styles.square} onClick={() => handleClick(idx)}>
            {val}
          </button>
        ))}
      </div>
      <button style={styles.restart} onClick={restart}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],           // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    backgroundColor: "#Ffb6c1",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    backgroundColor: "#Ffb6c1",
  },
  status: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
    backgroundColor: "#Ffb6c1",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 60px)",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "1rem",
    backgroundColor: "#Ffb6c1",
  },
  square: {
    width: "60px",
    height: "60px",
    fontSize: "24px",
    fontWeight: "bold",
    border: "2px solid #333",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f0ff0",
  },
  restart: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    
  },
};

export default App;
