import React, {useState, useEffect} from 'react';


function Square({value,onClick}) {

  return (

    <button className="square" onClick={onClick} style={{
        width: '80px',
        height: '80px',
        fontSize: '32px',
        fontWeight: 'bold',
        border: '2px solid #444',
        backgroundColor: '#f8f8f8',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background 0.2s ease',
      }}>
      {value}
    </button>
  );
}

function Board({xIsNext,squares,onPlay}) {
  function handleClick(i) {

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares=squares.slice();

    if(xIsNext) {
      nextSquares[i] = 'X';
    }else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares) ;
  }

    const winner = calculateWinner(squares);

    let gameStatus;

    if(winner) {
      gameStatus = 'Winner: ' + winner;
    }else {
      gameStatus = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <>
      <div style={{
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
      }}>
        Tic Tac Toe
      </div>

      <div style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>{gameStatus}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '5px' }}>
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    
      <div className="status">{gameStatus}</div>
     
      <div className="board-row">
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
          </div>

      <div className="board-row">
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </div>
      </>
    );
}

export default function Game() {

  const[history, sethistory] = useState([Array(9).fill(null)]);
  const[currentMove,setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  sethistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
}

function jumpTo(nextMove) {
setCurrentMove(nextMove);
}

const moves = history.map((squares, move) => {

  let description;

  if(move > 0) {
    description = 'Go to move #' + move;
  }else {
    description = 'Go to game start';
  }
  return (
    <li key={move}  style={{ marginBottom: '10px', listStyle: 'none' }}>
      <button 
      onClick={move === 0 ? () => jumpTo(0) : undefined}
      disabled={move !== 0}
      style ={{
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '6px',
        cursor: move === 0 ? 'pointer' : 'not-allowed',
        backgroundColor: move === 0 ? '#4CAF50' : '#ccc',
        color: move === 0 ? '#fff' : '#888',
        border: 'none',
        boxShadow: move === 0 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      }}
      >
        {description}
      </button>
    </li>
  );
});
return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}



