import { useEffect, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { switchAnimation } from '../../utils/switchAnimation';

export default function Man({ command, setCommand }) {
  const [man, setMan] = useState(null);
  const [animations, setAnimations] = useState({});
  const [mixer, setMixer] = useState(null);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [targetZ, setTargetZ] = useState(null);
  const [startZ, setStartZ] = useState(null);
  const { gl } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    const loader = new FBXLoader();

    const loadAnimations = async () => {
      const newAnimations = {};

      // Load idle animation
      loader.load('/models/man/idle.fbx', (object) => {
        setMan(object);
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        // Create the mixer for this model
        const mixer = new THREE.AnimationMixer(object);
        setMixer(mixer);

        // Store the idle animation
        newAnimations.idle = object.animations[0];
      });

      // Load other animations
      await Promise.all([
        loader.load('/models/man/walk.fbx', (object) => {
          newAnimations.walk = object.animations[0];
        }),
        loader.load('/models/man/run.fbx', (object) => {
          newAnimations.run = object.animations[0];
        })
      ]);

      // Set animations and mark them as loaded
      setAnimations(newAnimations);
      setAnimationsLoaded(true);
    };

    loadAnimations();
  }, [gl]);

  useEffect(() => {
    if (man && mixer && animations[command]) {
      switchAnimation(mixer, animations[command]);
    }

    if (man) {
      setStartZ(man.position.z);

      // Define target positions for walk and run
      if (command === 'walk') {
        setTargetZ(man.position.z + 20); // Walk moves 20 units forward
      } else if (command === 'run') {
        setTargetZ(man.position.z + 30); // Run moves 30 units forward
      }
    }
  }, [command, animations, mixer, man]);

  useEffect(() => {
    if (man && mixer && animationsLoaded) {
      const idleAction = mixer.clipAction(animations.idle);
      idleAction.play();
    }
  }, [man, mixer, animationsLoaded]);

  useFrame(() => {
    if (mixer) mixer.update(0.02);

    if (man && targetZ !== null) {
      // Incrementally move the model towards the target position
      if (man.position.z < targetZ) {
        man.position.z += command === 'run' ? 0.5 : 0.3; // Adjust speed based on command
      } else {
        setTargetZ(null); // Clear target when reached

        // Reset to idle animation once movement is complete
        if (command !== 'idle') {
          setCommand('idle');
        }
      }
    }
  });

  if (!man) return null;

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[0, 10, 10]} />
      <primitive object={man} scale={0.1} position={[15, 0, -50]} />
    </>
  );
}
