import React, { useState } from 'react';
import Switch from './switch-shake';
import ToeSmashGame from './artifact-component'

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(true); // Changed to true to skip start button

  const handleGameStart = () => {
    setGameStarted(true);
    // Add any other game initialization logic here
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <Switch onGameStart={handleGameStart} />
      ) : (
        <>
          <ToeSmashGame />
        </>
      )}
    </div>
  );
};

export default App;
