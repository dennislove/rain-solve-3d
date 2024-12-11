import React, { useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Background from './components/Background';
import Control from './components/GuestUI/Control';
import Man from './components/Character/Man';
import Beginer from './components/GuestUI/Beginer';
import RainSplash from './components/RainComponent/RainSplash';
import Sound from './components/Sound';
import Tree from './components/Tree';

function App() {
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

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#352D2C',
        display: 'relative'
      }}
    >
      <Beginer handleStart={handleStart} isLoading={isLoading} />

      <Canvas
        camera={{ position: [0, 1, 10], fov: 60 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
      >
        <ambientLight intensity={0.75} />
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

        <Man command={command} setCommand={handleCommandChange} />
        <Background />
        <Tree />

        <RainSplash rainSettings={rainSettings} />

        <OrbitControls
          minDistance={160} // Đặt khoảng cách mặc định
          minPolarAngle={0} // Giới hạn góc xoay dọc
          maxPolarAngle={Math.PI / 2} // Không vượt quá 180 độ
        />

        {/* <Sound
          url="/sounds/muathuachoem.mp3"
          loop={true}
          autoplay={true}
          volume={1.2}
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
