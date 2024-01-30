/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react';

function Square({value, onSquareClick}) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	);
}

function Board({xIsNext, squares, onPlay}) {
	const [status, setStatus] = useState('Nex Playe : X');

	useEffect(() => {
		const winner = calculateSquare(squares);

		if (winner) {
			setStatus(`Winner ${winner}`);
		} else {
			setStatus(`Next Player : ${xIsNext ? 'X' : 'O'}`);
		}
	}, [squares, xIsNext]);

	function handleClick(index) {
		if (squares[index] || calculateSquare(squares)) return;
		const nextSquares = squares.slice();
		nextSquares[index] = xIsNext ? 'X' : 'O';

		onPlay(nextSquares);
	}

	return (
		<>
			<div className="status">{status}</div>
			<div className="board">
				{squares.map((item, index) => {
					return (
						<Square
							key={index}
							value={item}
							onSquareClick={() => handleClick(index)}
						/>
					);
				})}
			</div>
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const currentSqueares = history[currentMove];
	const xIsNext = currentMove % 2 === 0;

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(move) {
		setHistory([...history.slice(0, move + 1)]);
		setCurrentMove(move);
	}

	const moves = history.map((squares, move) => {
		const desc = move > 0 ? `Go to move # ${move}` : `Play game started`;

		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{desc}</button>
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board">
				<Board
					xIsNext={xIsNext}
					squares={currentSqueares}
					onPlay={handlePlay}
				/>
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
}

function calculateSquare(squares) {
	// Rules game
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

		if (squares[a] && squares[b] === squares[a] && squares[b] === squares[c]) {
			return squares[a];
		}
	}

	return false;
}
