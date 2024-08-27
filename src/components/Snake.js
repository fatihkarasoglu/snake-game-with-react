import React from 'react';
import '../App.css';

const Snake = ({ snakeDots }) => {
  return (
    <div>
      {snakeDots.map((dot, i) => (
        <div
          className="snake-dot"
          key={i}
          style={{
            left: `${dot[0]}%`,
            top: `${dot[1]}%`,
            backgroundColor: i === snakeDots.length - 1 ? 'red' : '#222',
            borderRadius: i === snakeDots.length - 1 ? '50%' : '10%',
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snake;