import React from 'react';
import Notification from '../Notification';

const Beginer = ({ handleStart, isLoading }) => {
  return (
    <div
      onClick={handleStart}
      style={{
        position: 'absolute',
        backgroundColor: '#ffffff50',
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
        <img
          style={{
            width: '30%',
            top: '-100%',
            position: 'absolute'
          }}
          src="/icon/image_removepics.png"
          alt=""
        />

        <Notification />
      </div>
    </div>
  );
};

export default Beginer;
