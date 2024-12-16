import { useEffect, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { switchAnimation } from '../../utils/switchAnimation';

export default function Man({ rainSettings }) {
  const [rotationY, setRotationY] = useState(90 * (Math.PI / 180));
  const [man, setMan] = useState(null);
  const [animations, setAnimations] = useState({});
  const [mixer, setMixer] = useState(null);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [targetZ, setTargetZ] = useState(null);
  const [targetX, setTargetX] = useState(null);
  const [targetY, setTargetY] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startZ, setStartZ] = useState(null);
  const [step, setStep] = useState(true);
  const { gl } = useThree();
  const [command, setCommand] = useState('idle');
  const rainQuantity = rainSettings.rainIntensity;
  useEffect(() => {
    if (rainQuantity > 0 && rainQuantity <= 2000) {
      setTimeout(() => {
        setCommand('walk');
      }, 3000);
    } else if (rainQuantity > 2000 && rainQuantity <= 5000) {
      setTimeout(() => {
        setCommand('run');
      }, 3000);
    } else {
      setCommand('idle');
    }
  }, [rainQuantity]);

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
            // child.material.transparent = false;
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
      setStartZ(man.position.z);

      if (command === 'walk') {
        // Bắt đầu di chuyển đến điểm đầu tiên
        setTargetX(man.position.x + 100);
        setTargetZ(man.position.z);
        setStep(0);
      } else if (command === 'run') {
        setTargetX(man.position.x + 30);
        setTargetZ(man.position.z); // Chỉ chạy trên trục X
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

    if (man && targetX !== null && targetZ !== null) {
      const dx = targetX - man.position.x;
      const dz = targetZ - man.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 0.1) {
        // Tốc độ và logic phụ thuộc vào command
        const speed = command === 'run' ? 0.5 : 0.4;
        const rotationSpeed = command === 'run' ? 0.2 : 0.1;
        // Di chuyển nhân vật về phía mục tiêu
        man.position.x += (dx / distance) * speed;
        man.position.z += (dz / distance) * speed;

        // Quay nhân vật về hướng mục tiêu
        const targetRotationY = Math.atan2(dx, dz);
        man.rotation.y += (targetRotationY - man.rotation.y) * rotationSpeed; // Quay mượt mà
      } else {
        // Khi đạt mục tiêu, chuyển sang bước tiếp theo
        if (command === 'walk') {
          switch (step) {
            case 0:
              setTargetX(man.position.x);
              setTargetZ(man.position.z + 20);
              setStep(1);
              break;
            case 1:
              setTargetX(man.position.x - 100);
              setTargetZ(man.position.z);
              setStep(2);
              break;
            case 2:
              setTargetX(man.position.x);
              setTargetZ(man.position.z - 20);
              setStep(3);
              break;
            case 3:
              setTargetX(man.position.x + 100);
              setTargetZ(man.position.z);
              setStep(0);
              break;

            default:
              break;
          }
        } else if (command === 'run') {
          // Kết thúc chạy và về trạng thái "idle"
          setTargetX(null);
          setTargetZ(null);
          setCommand('idle');
        }
      }
    }
  });

  if (!man) return null;

  // Gán góc xoay từ state
  man.rotation.y = 90 * (Math.PI / 180);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight castShadow position={[0, 5, 10]} />
      <primitive object={man} scale={0.09} position={[-50, 0, 55]} />
    </>
  );
}
