import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Snake from './components/Snake';
import Bait from './components/Bait';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

function App() {

  const [snakeDots, setSnakeDots] = useState([
    [0, 6],
    [2, 6],
  ]);
  const [bait, setBait] = useState(getRandomCoordinates());
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.keyCode) {
        case 38:
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 40:
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 37:
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 39:
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [direction]);

  const checkIfCollapsed = useCallback((snake) => {
    let snakeBody = [...snake];
    let head = snakeBody[snakeBody.length - 1];
    snakeBody.pop();
    snakeBody.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  }, []);

  const checkIfOutOfBorders = useCallback((head) => {
    if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
      onGameOver();
    }
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }

      dots.push(head);

      if (head[0] === bait[0] && head[1] === bait[1]) {
        setBait(getRandomCoordinates());
        setScore((prev) => prev + 1);

        if ((score + 1) % 5 === 0) {
          setLevel((prev) => prev + 1);
        }

        setSpeed((prev) => Math.max(50, prev - 10));
      } else {
        dots.shift();
      }

      checkIfOutOfBorders(head);
      checkIfCollapsed(dots);
      setSnakeDots(dots);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snakeDots, direction, bait, speed, gameOver, checkIfCollapsed, checkIfOutOfBorders, score]);

  const startNewGame = () => {
    setSnakeDots([
        [0, 6],
        [2, 6],
    ]);
    setBait(getRandomCoordinates());
    setDirection('RIGHT');
    setSpeed(200);
    setLevel(1);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
        return true;
      }
      if (/iPad|iPhone/.test(userAgent) && !window.MSStream) {
        return true;
      }
      return false;
    };
    setIsMobile(checkIfMobile());
  }, []);

  const onGameOver = () => {
    setGameOver(true);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score);
    }
  };

  useEffect(() => {
    if (gameOver) {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('bestScore', score);
        }
    }
}, [gameOver, score, bestScore]);

  return (
    <div className="game-container">
      <div className="score-info">
        <div className='footer'>
          <span>Created By FATİH KARAŞOĞLU</span>
        </div>
        <div className='main-si'>
          <button className="new-game-button" onClick={startNewGame}>New Game</button>
          <div>Score: {score}</div>
          <div>Level: {level}</div>
          <div>Best Score: {bestScore}</div>
          <div>
            <a href="https://github.com/fatihkarasoglu" target="_blank" rel="noopener noreferrer" title='Fatih Karaşoğlu on Github'>
              <FaGithub size={25} style={{ color : 'white'}} />
            </a>
            <a href="https://www.linkedin.com/in/fatihkarasoglu/" target="_blank" rel="noopener noreferrer" title='Fatih Karaşoğlu on LinkedIn'>
              <FaLinkedin size={25} style={{ color : 'white'}} />
            </a>
          </div>
        </div>
      </div>
      <div className="game-area">
        <div className="game-board">
          <Snake snakeDots={snakeDots} />
          <Bait dot={bait} />
          {gameOver && <div className="game-over">Game Over</div>}
        </div>
      </div>
      {isMobile ? (
        <div className="controls">
          <button onClick={() => setDirection('UP')}>↑</button>
          <div>
            <button onClick={() => setDirection('LEFT')}>←</button>
            <button onClick={() => setDirection('DOWN')}>↓</button>
            <button onClick={() => setDirection('RIGHT')}>→</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;