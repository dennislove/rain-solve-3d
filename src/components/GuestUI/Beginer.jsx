import React from 'react';
import Notification from '../Notification';

const Beginer = ({ handleStart, isLoading }) => {
  return (
    <div
      onClick={handleStart}
      style={{
        position: 'absolute',
        backgroundImage: 'url("/rain.jpg")',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        top: '0',
        cursor: 'pointer',
        zIndex: isLoading ? 20 : -1
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          height: '30vh',
          backgroundColor: 'white',
          top: '30%'
        }}
      >
        <Notification />
      </div>
    </div>
  );
};

export default Beginer;
