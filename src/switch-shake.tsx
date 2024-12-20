import React from 'react';

interface SwitchProps {
  onGameStart: () => void;
}

const Switch: React.FC<SwitchProps> = ({ onGameStart }) => {
  return (
    <button onClick={onGameStart}>
      Start Game
    </button>
  );
};

export default Switch;