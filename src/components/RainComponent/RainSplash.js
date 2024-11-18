import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
const RainSplash = ({ crossFall = 0, rainSettings }) => {
  const instancedMeshRef = useRef();
  const gltf = useLoader(GLTFLoader, '/models/raindot.glb');

  // Generate random initial positions for the raindrops
  const initialPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < rainSettings.rainIntensity; i++) {
      positions.push({
        x: (Math.random() - 0.3) * 300,
        y: Math.random() * 200,
        z: (Math.random() - 0.5) * 250
      });
    }
    return positions;
  }, [rainSettings.rainIntensity]);

  useFrame(() => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      const crossFallTan = Math.tan(crossFall);
      initialPositions.forEach((position, i) => {
        position.y -= rainSettings.fallSpeed; // Move the raindrop down
        //position.z += crossFallTan * fallSpeed;
        if (position.y < 0) {
          position.y = 200;
          // position.z = (Math.random() - 0.3) * 300;
        } // Reset position if below ground

        // Update the dummy object's position
        dummy.position.set(position.x, position.y, position.z);
        // dummy.rotation.set(Math.PI / 2, 0, 0); //-90 độ
        dummy.scale.set(0.5, 0.7, 0.5); // scale
        dummy.updateMatrix();

        // Apply the updated matrix to the instance
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      });

      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Suspense fallback={null}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[
          gltf.scene.children[0].geometry,
          gltf.scene.children[0].material,
          rainSettings.rainIntensity
        ]}
      >
        {/* Optionally customize the material */}
        <meshBasicMaterial color="white" />
      </instancedMesh>
    </Suspense>
  );
};

export default RainSplash;
