import React from 'react';
import 'animate.css';
const Notification = () => {
  return (
    <div
      className="animate__animated animate__fadeInUp"
      style={{
        position: 'relative'
      }}
    >
      <img
        style={{
          width: '20%',
          top: '-90%',
          left: '20%',
          zIndex: '-1',
          position: 'absolute'
        }}
        src="/icon/image_removepics.png"
        alt=""
      />
      <h1
        style={{
          textAlign: 'center',
          fontSize: '60px',
          fontFamily: 'Dancing Script',
          fontOpticalSizing: 'auto',
          marginTop: '40px'
        }}
      >
        Bạn có từng nghĩ,
        <br /> mưa lớn sẽ ra sao, mưa nhỏ sẽ như nào chưa?
      </h1>
    </div>
  );
};

export default Notification;
