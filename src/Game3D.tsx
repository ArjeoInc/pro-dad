import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Toe3DProps {
  style: string;
  isSmashed: boolean;
  multiplier: number;
}

const TOE_STYLES = {
  basic: { color: "#ffd1dc" },
  pink: { color: "#ff69b4" },
  red: { color: "#cc0000" },
  blue: { color: "#0044cc" },
  golden: { color: "#daa520" }
};

export const Toe3D: React.FC<Toe3DProps> = ({ style, isSmashed, multiplier }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nailColor = TOE_STYLES[style as keyof typeof TOE_STYLES]?.color || "#ffd1dc";

  useFrame((state) => {
    if (groupRef.current) {
      // Idle animation
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 2) * 0.1;

      if (isSmashed) {
        groupRef.current.scale.set(1.2, 0.5, 1.2);
        groupRef.current.rotation.z = 0.1;
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        groupRef.current.rotation.z = 0;
      }

      if (multiplier > 2) {
         groupRef.current.rotation.y = Math.sin(t * 10) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Main Toe Body */}
      <mesh position={[0, 1.5, 0]}>
        <capsuleGeometry args={[1, 2.5, 4, 16]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.3} />
      </mesh>

      {/* Toenail */}
      <mesh position={[0, 2.2, 0.8]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        <meshStandardMaterial
            color={nailColor}
            metalness={style === 'golden' ? 0.8 : 0.1}
            roughness={style === 'golden' ? 0.1 : 0.3}
        />
      </mesh>

      {/* Nail Shine/Highlight */}
       <mesh position={[0, 2.2, 0.86]} rotation={[-0.2, 0, 0]}>
         <planeGeometry args={[0.5, 0.5]} />
         <meshBasicMaterial color="white" opacity={0.3} transparent />
       </mesh>

      {/* Knuckle Wrinkles */}
      <mesh position={[0, 1.5, 0.9]} rotation={[0, 0, 0]}>
         <torusGeometry args={[0.8, 0.05, 16, 32, 2]} />
         <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[0, 1.2, 0.9]} rotation={[0, 0, 0]}>
         <torusGeometry args={[0.85, 0.05, 16, 32, 2]} />
         <meshStandardMaterial color="#d4a574" />
      </mesh>

    </group>
  );
};

export const Hammer3D: React.FC<{ isSmashing: boolean }> = ({ isSmashing }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      if (isSmashing) {
         // Simple smash animation
         groupRef.current.rotation.x = -Math.PI / 2;
         groupRef.current.position.y = 0.5;
         groupRef.current.position.z = 0;
      } else {
         groupRef.current.rotation.x = 0;
         groupRef.current.position.y = 4;
         groupRef.current.position.z = 2;
      }

      // Smooth return would be better but simple logic for now
       const targetRot = isSmashing ? -Math.PI / 3 : 0;
       const targetY = isSmashing ? 0 : 5;
       const targetZ = isSmashing ? 0 : 2;

       groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot, 0.2);
       groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
       groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 5, 2]}>
      {/* Handle */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4, 16]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Head */}
      <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <RoundedBox args={[1.5, 2.5, 1.5]} radius={0.1} smoothness={4}>
           <meshStandardMaterial color="#546e7a" metalness={0.6} roughness={0.2} />
        </RoundedBox>
      </group>
    </group>
  );
};

export const BloodParticles: React.FC<{ active: boolean }> = ({ active }) => {
  const count = 100;
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1;
      const y = (Math.random() - 0.5) * 1 + 2; // start near the toe tip
      const z = (Math.random() - 0.5) * 1;
      const velocity = new THREE.Vector3(
         (Math.random() - 0.5) * 10,
         Math.random() * 10,
         (Math.random() - 0.5) * 10
      );
      temp.push({ position: new THREE.Vector3(x, y, z), velocity, life: 0, maxLife: 1 });
    }
    return temp;
  });

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    // If active (just smashed), reset some particles
    if (active) {
       particles.forEach(p => {
          if (p.life <= 0) {
             p.life = 1; // activate
             p.position.set(0, 2.2, 0.8); // Reset to toe position
             p.velocity.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10 + 5
             );
          }
       });
    }

    particles.forEach((particle, i) => {
      if (particle.life > 0) {
        particle.position.addScaledVector(particle.velocity, delta);
        particle.velocity.y -= 20 * delta; // Gravity
        particle.life -= delta * 1.5;

        // Floor collision
        if (particle.position.y < -2) {
            particle.velocity.y *= -0.5;
            particle.position.y = -2;
        }

        const scale = particle.life; // shrink over time
        dummy.position.copy(particle.position);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.scale.set(0,0,0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      }
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#8a0303" roughness={0.1} metalness={0.5} />
    </instancedMesh>
  );
};
