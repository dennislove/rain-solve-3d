import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

export default function Background() {
  const bg = useGLTF('/models/backgrounds/untitled.glb');
  const animations = useAnimations(bg.animations, bg.scene);
  bg.scene.rotation.y = -90 * (Math.PI / 180);
  useEffect(() => {
    // const action = animations.actions['Cube.002|Cube.002Action'];
    // action.play();

    bg.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false; // Prevent background from casting shadows
        child.receiveShadow = true; // Enable background to receive shadows
        // child.material.transparent = true; // Allow blending
      }
    });
  }, [bg, animations]);

  // Set render order lower than other objects, so background renders first
  bg.scene.renderOrder = 0;

  return <primitive object={bg.scene} scale={4} position={[0, -5, 10]} />;
}
