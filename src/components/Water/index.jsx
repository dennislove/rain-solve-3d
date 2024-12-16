import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useEffect } from 'react';

const Water = () => {
  const water = useGLTF('/models/water.glb');
  const animations = useAnimations(water.animations, water.scene);
  console.log(animations);
  useEffect(() => {
    const action = animations.actions['Take 01'];
    action.play();

    water.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false; // Prevent background from casting shadows
        child.receiveShadow = true; // Enable background to receive shadows
        child.material.transparent = true; // Allow blending
        child.material.depthWrite = true;
      }
    });
  }, [water, animations]);

  // Set render order lower than other objects, so background renders first
  water.scene.renderOrder = -1;

  return <primitive object={water.scene} scale={(200, 10, 100)} />;
};
export default Water;
