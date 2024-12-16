import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
const RainSplash = ({ crossFall = 0, rainSettings }) => {
  const instancedMeshRef = useRef();
  const gltf = useLoader(GLTFLoader, '/models/raindot.glb');

  // Generate random initial positions for the raindrops
  const rainQuantity = rainSettings.rainIntensity;
  const initialPositions = useMemo(() => {
    const positions = [];

    for (let i = 0; i < rainQuantity; i++) {
      const maxRadius = 120; // Bán kính của hình trụ
      const height = 300; // Chiều cao của hình trụ
      const heightMax = 300; // Chiều cao của hình trụ

      // Tọa độ hình trụ
      const radius = Math.sqrt(Math.random()) * maxRadius;
      const theta = Math.random() * Math.PI * 2; // Góc ngẫu nhiên (0 đến 360 độ)
      const y = Math.random() * height; // Chiều cao ngẫu nhiên
      const x = radius * Math.cos(theta); // Tọa độ X
      const z = radius * Math.sin(theta); // Tọa độ Z

      if (radius <= maxRadius && y >= 0 && y <= heightMax) {
        positions.push({ x, y, z });
      }
    }
    return positions;
  }, [rainQuantity]);

  let rainWidth;
  let rainHeigh;

  if (rainQuantity > 0 && rainQuantity <= 2000) {
    rainWidth = 0.2;
    rainHeigh = 1;
  } else if (rainQuantity > 2000 && rainQuantity <= 5000) {
    rainWidth = 0.3;
    rainHeigh = 1.3;
  } else {
    rainWidth = 1;
    rainHeigh = 1.4;
  }

  useFrame(() => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      const crossFallTan = Math.tan(crossFall);
      initialPositions.forEach((position, i) => {
        position.y -= rainSettings.fallSpeed; // Move the raindrop down
        //position.z += crossFallTan * fallSpeed;
        if (position.y < 0) {
          position.y = 180;
        } // Reset position if below ground

        // Update the dummy object's position
        dummy.position.set(position.x, position.y, position.z);
        // dummy.rotation.set(Math.PI / 2, 0, 0); //-90 độ
        dummy.scale.set(rainWidth, rainHeigh, rainWidth); // scale
        dummy.updateMatrix();

        // Apply the updated matrix to the instance
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      });

      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Suspense fallback={null}>
      <group rotation={[Math.PI / 90, 0, -50]} position={[0, -28, 0]}>
        <instancedMesh
          ref={instancedMeshRef}
          args={[
            gltf.scene.children[0].geometry,
            gltf.scene.children[0].material,
            rainQuantity
          ]}
        >
          {/* Optionally customize the material */}
          <meshBasicMaterial color="white" />
        </instancedMesh>
      </group>
    </Suspense>
  );
};

export default RainSplash;
