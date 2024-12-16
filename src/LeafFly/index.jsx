import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
const LeafFly = ({ position }) => {
  const originalLeaf = useGLTF('/models/leaf2.glb');

  // Clone the model for each instance
  const leaf = useMemo(() => originalLeaf.scene.clone(), [originalLeaf]);
  const animations = useAnimations(originalLeaf.animations, leaf);

  // leaf.scene.rotation.y = -90 * (Math.PI / 180);
  useEffect(() => {
    const action = animations.actions['Object_4Action'];
    action.play();

    leaf.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false; // Prevent background from casting shadows
        child.receiveShadow = true; // Enable background to receive shadows
        child.material.transparent = true; // Allow blending
      }
    });
  }, [leaf, animations]);

  // leaf.scene.renderOrder = 2;
  leaf.renderOrder = 2;
  return (
    <primitive
      object={leaf}
      scale={4}
      rotation={[0, 90, 0]}
      position={position}
    />
  );
};

export default LeafFly;
