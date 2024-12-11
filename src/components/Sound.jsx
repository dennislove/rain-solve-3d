import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Sound = ({ url, loop = false, autoplay = false, volume }) => {
  const soundRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener); // Non-positional audio
    soundRef.current = sound;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(loop);
      sound.setVolume(volume);

      if (autoplay) sound.play();
    });

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [url, loop, autoplay, volume, camera]);

  return null; // This component does not render any visible content
};

export default Sound;
