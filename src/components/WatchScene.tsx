import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Environment, Lightformer } from '@react-three/drei';
import { Suspense } from 'react';
import WatchModel from './WatchModel';
import type { WatchConfig } from '../App';

interface Props {
  config: WatchConfig;
  isSwapping: boolean;
  arMode: boolean;
}

export default function WatchScene({ config, isSwapping, arMode }: Props) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting for PBR */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#a0c4ff" />
          <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffd700" />
          <spotLight
            position={[0, 5, 3]}
            angle={0.3}
            penumbra={0.8}
            intensity={1}
            castShadow
          />

          {/* Environment using Lightformers - no external HDR files needed */}
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2} position={[0, 4, -3]} scale={[10, 2, 1]} />
            <Lightformer form="rect" intensity={1} position={[0, -4, -3]} scale={[10, 2, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[5, 0, -3]} scale={[2, 10, 1]} />
            <Lightformer form="rect" intensity={1.5} position={[-5, 0, -3]} scale={[2, 10, 1]} />
            <Lightformer form="ring" intensity={0.8} position={[0, 0, -5]} scale={5} color="#ffd700" />
            <Lightformer form="circle" intensity={0.5} position={[3, 3, 3]} scale={2} color="#a0c4ff" />
            <Lightformer form="circle" intensity={0.5} position={[-3, -3, 3]} scale={2} color="#ff9999" />
          </Environment>

          {/* Watch Model */}
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <WatchModel config={config} isSwapping={isSwapping} />
          </Float>

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Orbit Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate={!arMode}
            autoRotateSpeed={0.5}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
