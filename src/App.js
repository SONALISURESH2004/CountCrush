import React, { useState } from 'react';
import FingerCounter from './FingerCounter';
import Abacus from './Abacus';
import './App.css';

function generateQuestion(level) {
  const operators = level === 'Easy' ? ['+', '-'] : ['+', '-', '*'];
  const maxNum = level === 'Easy' ? 10 : level === 'Medium' ? 20 : 50;

  const num1 = Math.floor(Math.random() * maxNum) + 1;
  const num2 = Math.floor(Math.random() * maxNum) + 1;
  const op = operators[Math.floor(Math.random() * operators.length)];

  let question = `${num1} ${op} ${num2}`;
  let answer = eval(question);

  return { question, answer };
}

export default function App() {
  const [level, setLevel] = useState(null);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showAbacus, setShowAbacus] = useState(false);
  const [expectedAnswer, setExpectedAnswer] = useState(null);

  React.useEffect(() => {
    if (level && !gameOver) {
      setTimeLeft(30);
      setScore(0);
      nextQuestion();
    }
  }, [level]);

  React.useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      setShowAbacus(false);
    }
    if (timeLeft > 0 && !gameOver && level) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameOver, level]);

  function nextQuestion() {
    const q = generateQuestion(level);
    setQuestion(q.question);
    setExpectedAnswer(q.answer);
    setShowAbacus(true);
  }

  function handleAnswer(fingerCount) {
    if (!showAbacus) return;
    if (fingerCount === expectedAnswer) {
      setScore(score + 1);
      nextQuestion();
    }
  }

  function startGame(selectedLevel) {
    setLevel(selectedLevel);
    setGameOver(false);
    setScore(0);
    setShowAbacus(false);
    setQuestion(null);
  }

  return (
    <div className="app-container">
      {!level && (
        <div className="level-select">
          <h2>Select Difficulty Level</h2>
          {['Easy', 'Medium', 'Hard'].map(lvl => (
            <button key={lvl} onClick={() => startGame(lvl)}>
              {lvl}
            </button>
          ))}
        </div>
      )}

      {level && !gameOver && (
        <div className="game-area">
          <div className="header">
            <h3>Level: {level}</h3>
            <h3>Time Left: {timeLeft}s</h3>
            <h3>Score: {score}</h3>
          </div>

          {question && <h2 className="question">Calculate: {question}</h2>}

          {showAbacus && (
            <FingerCounter onFingerCount={handleAnswer} />
          )}

          <Abacus />
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={() => setLevel(null)}>Play Again</button>
        </div>
      )}
    </div>
  );
}
