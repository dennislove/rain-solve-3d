import React from 'react';
import 'animate.css';
const Notification = () => {
  return (
    <div
      className="animate__animated animate__fadeInUp"
      style={{
        backgroundColor: 'red'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '60px',
          fontFamily: 'Dancing Script',
          fontOpticalSizing: 'auto',
          marginTop: '40px'
        }}
      >
        Em có nghe,
        <br /> mùa thu mưa giăng lá đổ?
      </h1>
      <audio src="/sounds/muathuachoem.mp3" autoPlay loop controls></audio>
    </div>
  );
};

export default Notification;
