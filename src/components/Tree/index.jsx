import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
const Tree = () => {
  const bg = useGLTF('/models/tree.glb');
  const animations = useAnimations(bg.animations, bg.scene);
  // console.log(animations);
  bg.scene.rotation.y = -90 * (Math.PI / 180);
  useEffect(() => {
    const action = animations.actions['Armature|Armature|ArmatureAction'];
    action.play();

    bg.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false; // Prevent background from casting shadows
        child.receiveShadow = true; // Enable background to receive shadows
        child.material.transparent = true; // Allow blending
      }
    });
  }, [bg, animations]);

  // Set render order lower than other objects, so background renders first
  bg.scene.renderOrder = 1;

  return <primitive object={bg.scene} scale={0.8} position={[-80, 2, 33]} />;
};

export default Tree;
