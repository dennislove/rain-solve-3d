import React from 'react';

const Beginer = ({ handleStart, isLoading }) => {
  return (
    <div
      onClick={handleStart}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        alignItems: 'center',
        zIndex: isLoading ? 20 : -1
      }}
    >
      <h2>Click anywhere to start</h2>
    </div>
  );
};

export default Beginer;
