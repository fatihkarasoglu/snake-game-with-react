import React from 'react';
import '../App.css';

const Bait = ({ dot }) => {
  return (
    <div
      className="bait"
      style={{
        left: `${dot[0]}%`,
        top: `${dot[1]}%`
      }}
    ></div>
  );
};

export default Bait;