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
  const [targetX, setTargetX] = useState(null);
  const [targetY, setTargetY] = useState(null);
  const [startX, setStartX] = useState(null);
  const { gl } = useThree();
  // const { command, setCommand } = useState();
  // const rainQuantity = rainSettings.rainIntensity;
  // console.log(rainQuantity);
  // if (rainQuantity > 0 && rainQuantity <= 1000) {
  //   command = 'walk';
  // } else if (rainQuantity > 1000 && rainQuantity < 5000) {
  //   command = 'run';
  // } else {
  //   command = 'idle';
  // }

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
        }),
        loader.load('/models/man/Praying.fbx', (object) => {
          newAnimations.pray = object.animations[0];
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
      setStartX(man.position.x);

      // Define target positions for walk and run
      if (command === 'walk') {
        setTargetX(man.position.x + 20);
        // setTargetX(man.position.x + 20);
      } else if (command === 'run') {
        setTargetX(man.position.x + 30); // Run moves 30 units forward
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

    if (man && targetX !== null) {
      // Incrementally move the model towards the target position
      if (man.position.x < targetX) {
        man.position.x += command === 'run' ? 0.5 : 0.4; // Adjust speed based on command
      } else {
        setTargetX(null); // Clear target when reached

        // Reset to idle animation once movement is complete
        if (command !== 'idle') {
          setCommand('idle');
        }
      }
    }
  });

  if (!man) return null;
  man.rotation.y = 90 * (Math.PI / 180);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[0, 10, 10]} />
      <primitive object={man} scale={0.09} position={[-50, 0, 65]} />
    </>
  );
}
