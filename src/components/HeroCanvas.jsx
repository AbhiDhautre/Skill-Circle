import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Torus, Points, PointMaterial, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ---- Floating Orb ---- */
function FloatingOrb({ mouseRef }) {
  const meshRef = useRef();
  const t = useRef(0);

  useFrame((state, delta) => {
    t.current += delta;
    if (!meshRef.current) return;

    // Float
    meshRef.current.position.y = Math.sin(t.current * 0.6) * 0.18;
    meshRef.current.position.x = Math.sin(t.current * 0.4) * 0.1;

    // Mouse react
    if (mouseRef.current) {
      meshRef.current.position.x += mouseRef.current.x * 0.25;
      meshRef.current.position.y += mouseRef.current.y * 0.15;
    }

    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.z += delta * 0.08;
  });

  return (
    <Sphere ref={meshRef} args={[1.1, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#4338ca"
        emissiveIntensity={0.6}
        roughness={0.15}
        metalness={0.4}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.92}
      />
    </Sphere>
  );
}

/* ---- Holographic Rings ---- */
function HolographicRings({ mouseRef }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state, delta) => {
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.3;
      ring1.current.rotation.y += delta * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.x -= delta * 0.2;
      ring2.current.rotation.z += delta * 0.15;
    }
    if (ring3.current) {
      ring3.current.rotation.y += delta * 0.35;
      ring3.current.rotation.x += delta * 0.1;
    }

    if (mouseRef.current && ring1.current) {
      ring1.current.rotation.y += mouseRef.current.x * 0.008;
      ring2.current.rotation.x += mouseRef.current.y * 0.006;
    }
  });

  return (
    <group>
      <Torus ref={ring1} args={[1.8, 0.015, 16, 100]} rotation={[0.3, 0, 0]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.55} />
      </Torus>
      <Torus ref={ring2} args={[2.3, 0.01, 16, 100]} rotation={[1.2, 0.3, 0]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </Torus>
      <Torus ref={ring3} args={[2.9, 0.008, 16, 100]} rotation={[0.8, 0.6, 0.2]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
      </Torus>
    </group>
  );
}

/* ---- Particle Field ---- */
function ParticleField() {
  const pointsRef = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 1200; // Increased count for full screen
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0.388, 0.4, 0.953],   // indigo #6366f1
      [0.133, 0.831, 0.933], // cyan #22d3ee
      [0.545, 0.361, 0.965], // violet #8b5cf6
      [0.055, 0.647, 0.914], // sky #0ea5e9
      [1, 1, 1],             // white stars
      [1, 1, 1],             // white stars (more frequent)
    ];

    for (let i = 0; i < count; i++) {
      // Scatter in a wide rectangular volume
      positions[i * 3] = (Math.random() - 0.5) * 25;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // z

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation
        opacity={0.7}
        depthWrite={false}
      />
    </Points>
  );
}

/* ---- Skill Nodes ---- */
function SkillNodes({ mouseRef }) {
  const groupRef = useRef();
  const t = useRef(0);

  const nodes = useMemo(() => {
    const skills = ["React", "ML", "UI/UX", "Python", "Node", "Go"];
    const colors = ["#6366f1", "#22d3ee", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b"];
    return skills.map((skill, i) => {
      const angle = (i / skills.length) * Math.PI * 2;
      const radius = 1.8;
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle * 0.7) * 0.6,
          Math.sin(angle) * radius,
        ],
        color: colors[i],
        label: skill,
      };
    });
  }, []);

  useFrame((state, delta) => {
    t.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = t.current * 0.08;
      if (mouseRef.current) {
        groupRef.current.rotation.x = mouseRef.current.y * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <Sphere args={[0.12, 16, 16]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.5}
              roughness={0.2}
              metalness={0.5}
            />
          </Sphere>
          {/* Connection line to center */}
          <primitive
            object={(() => {
              const points = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(-node.position[0], -node.position[1], -node.position[2]),
              ];
              const geo = new THREE.BufferGeometry().setFromPoints(points);
              const mat = new THREE.LineBasicMaterial({
                color: node.color,
                transparent: true,
                opacity: 0.25,
              });
              return new THREE.Line(geo, mat);
            })()}
          />
        </group>
      ))}
    </group>
  );
}

/* ---- Camera drift ---- */
function CameraDrift({ mouseRef }) {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((state, delta) => {
    t.current += delta;
    const baseX = Math.sin(t.current * 0.15) * 0.3;
    const baseY = Math.cos(t.current * 0.1) * 0.2;

    const targetX = baseX + (mouseRef.current?.x ?? 0) * 0.8;
    const targetY = baseY + (mouseRef.current?.y ?? 0) * 0.5;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ---- Scene Wrapper for Offsets ---- */
function SceneObjects({ mouseRef }) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  // Shift objects to the right if not on mobile
  const xOffset = isMobile ? 0 : viewport.width * 0.25;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} color="#6366f1" intensity={3} />
      <pointLight position={[-4, -2, -4]} color="#22d3ee" intensity={2} />
      <pointLight position={[0, -4, 2]} color="#8b5cf6" intensity={1.5} />

      {/* 3D Objects */}
      <group position={[xOffset, 0, 0]}>
        <FloatingOrb mouseRef={mouseRef} />
        <HolographicRings mouseRef={mouseRef} />
        <SkillNodes mouseRef={mouseRef} />
      </group>
      
      {/* Particles are at center, filling the screen */}
      <ParticleField />

      {/* Camera */}
      <CameraDrift mouseRef={mouseRef} />
    </>
  );
}

/* ---- Main Canvas Component ---- */
export default function HeroCanvas({ mouseRef }) {
  return (
    <div className="hero-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneObjects mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
