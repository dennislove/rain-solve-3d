import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Background from './components/Background';
import Control from './components/GuestUI/Control';
import Man from './components/Character/Man';
import Beginer from './components/GuestUI/Beginer';
import RainSplash from './components/RainComponent/RainSplash';
import Sound from './components/Sound';

function App() {
  const modelRef = useRef();
  const [rainSettings, setRainSettings] = useState({
    rainIntensity: 0,
    fallSpeed: 1,
    windSpeed: 2
  });
  const [isLoading, setIsLoading] = useState(true);
  const handleStart = () => {
    setIsLoading(false);
  };

  const [command, setCommand] = useState('');
  const handleCommandChange = (newCommand) => {
    setCommand(newCommand);
  };

  const [modelPosition, setModelPosition] = useState([10, -20, 0]);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#001f3d',
        display: 'relative'
      }}
    >
      {/* <Beginer handleStart={handleStart} isLoading={isLoading} /> */}

      <Canvas
        camera={{ position: [0, 1, 10], fov: 60 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[-85, 100, 100]}
          castShadow
          intensity={1.0}
          shadow-mapSize-width={2048} // Increase shadow map resolution
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500} // Extend far distance
          shadow-camera-left={-100} // Widen shadow frustum boundaries
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Man
          command={command}
          setCommand={handleCommandChange}
          modelPosition={modelPosition}
        />
        <Background modelPosition={modelPosition} />

        <RainSplash rainSettings={rainSettings} />

        <OrbitControls
        // minDistance={corner} // Đặt khoảng cách mặc định là 30
        // maxDistance={corner} // Ngăn thay đổi khoảng cách
        // minPolarAngle={0} // Giới hạn góc xoay dọc
        // maxPolarAngle={Math.PI} // Không vượt quá 360 độ
        />

        {/* <Sound
          url="/sounds/rain-normal.mp3"
          loop={true}
          autoplay={true}
          volume={0.04}
        /> */}
      </Canvas>
      {/* Control component để điều chỉnh cài đặt mưa */}
      <Control
        onCommandChange={handleCommandChange}
        rainSettings={rainSettings}
        setRainSettings={setRainSettings}
      />

      {/* thêm các component để mô tả các sự kiện click */}
    </div>
  );
}

export default App;
