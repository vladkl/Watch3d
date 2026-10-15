import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { WatchConfig } from '../App';

interface Props {
  config: WatchConfig;
  isSwapping: boolean;
}

// Get material properties based on case material type
function getCaseMaterialProps(material: string, color: string) {
  switch (material) {
    case 'gold':
      return { metalness: 1, roughness: 0.15, color: '#ffd700' };
    case 'rosegold':
      return { metalness: 1, roughness: 0.2, color: '#e8a87c' };
    case 'ceramic':
      return { metalness: 0.1, roughness: 0.05, color, envMapIntensity: 2 };
    case 'metal':
    default:
      return { metalness: 0.95, roughness: 0.1, color };
  }
}

// Animated watch hands that track real time
function WatchHands({ color, style }: { color: string; style: string }) {
  const hourRef = useRef<THREE.Group>(null);
  const minuteRef = useRef<THREE.Group>(null);
  const secondRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    if (secondRef.current) {
      secondRef.current.rotation.z = -(seconds / 60) * Math.PI * 2;
    }
    if (minuteRef.current) {
      minuteRef.current.rotation.z = -(minutes / 60) * Math.PI * 2;
    }
    if (hourRef.current) {
      hourRef.current.rotation.z = -(hours / 12) * Math.PI * 2;
    }
  });

  const handShape = useMemo(() => {
    switch (style) {
      case 'sword':
        return { hourLen: 0.6, minLen: 0.85, secLen: 0.95, hourWidth: 0.06, minWidth: 0.05 };
      case 'baton':
        return { hourLen: 0.55, minLen: 0.8, secLen: 0.9, hourWidth: 0.04, minWidth: 0.03 };
      case 'dauphine':
      default:
        return { hourLen: 0.6, minLen: 0.85, secLen: 0.95, hourWidth: 0.06, minWidth: 0.045 };
    }
  }, [style]);

  return (
    <group position={[0, 0, 0.2]}>
      {/* Hour hand */}
      <group ref={hourRef}>
        <mesh position={[0, handShape.hourLen / 2, 0]} castShadow>
          <boxGeometry args={[handShape.hourWidth, handShape.hourLen, 0.03]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Minute hand */}
      <group ref={minuteRef}>
        <mesh position={[0, handShape.minLen / 2, 0.02]} castShadow>
          <boxGeometry args={[handShape.minWidth, handShape.minLen, 0.03]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Second hand */}
      <group ref={secondRef}>
        <mesh position={[0, handShape.secLen / 2, 0.04]} castShadow>
          <boxGeometry args={[0.02, handShape.secLen, 0.02]} />
          <meshStandardMaterial 
            color="#ff3333" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Counterweight */}
        <mesh position={[0, -0.12, 0.04]}>
          <circleGeometry args={[0.035, 16]} />
          <meshStandardMaterial 
            color="#ff3333" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#ff0000"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Center pin */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={1} 
          roughness={0.05}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Hour markers
function HourMarkers({ dialColor }: { dialColor: string }) {
  const markers = useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 0.85;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;
      const isMain = i % 3 === 0;
      items.push({ x, y, isMain, angle, index: i });
    }
    return items;
  }, []);

  const isLightDial = dialColor === '#ffffff' || dialColor === '#f5f5f5' || dialColor === '#f5e6c8';

  return (
    <group position={[0, 0, 0.18]}>
      {markers.map(({ x, y, isMain, angle, index }) => (
        <mesh
          key={index}
          position={[x, y, 0]}
          rotation={[0, 0, -angle]}
        >
          <boxGeometry args={[isMain ? 0.04 : 0.02, isMain ? 0.12 : 0.06, 0.015]} />
          <meshStandardMaterial
            color={isLightDial ? '#333333' : '#ffffff'}
            metalness={0.8}
            roughness={0.2}
            emissive={isLightDial ? '#000000' : '#ffffff'}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {/* Minute markers */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i / 60) * Math.PI * 2;
        const radius = 0.88;
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        return (
          <mesh key={`min-${i}`} position={[x, y, 0]} rotation={[0, 0, -angle]}>
            <boxGeometry args={[0.01, 0.035, 0.008]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.5} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// Complication with hover glow
function Complication({
  position,
  type,
  visible,
}: {
  position: [number, number, number];
  type: 'date' | 'chrono' | 'moonphase';
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (glowRef.current) {
      const target = hovered ? 0.8 : 0.0;
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * delta * 5;
    }
    if (meshRef.current && type === 'moonphase') {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Glow ring */}
      <mesh ref={glowRef}>
        <ringGeometry args={[0.16, 0.2, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Complication face */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.01]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial
          color={type === 'date' ? '#222222' : type === 'moonphase' ? '#0a0a2a' : '#1a1a1a'}
          metalness={0.3}
          roughness={0.5}
          emissive="#333333"
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Complication content */}
      {type === 'date' && (
        <group position={[0, 0, 0.02]}>
          <mesh>
            <planeGeometry args={[0.14, 0.1]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Date number indicator */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      )}
      {type === 'moonphase' && (
        <mesh position={[0, 0.02, 0.02]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial 
            color="#f5f5dc" 
            emissive="#f5f5dc" 
            emissiveIntensity={0.4}
          />
        </mesh>
      )}
      {type === 'chrono' && (
        <>
          <mesh position={[0, 0, 0.02]}>
            <ringGeometry args={[0.1, 0.12, 32]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.015, 0.12, 0.008]} />
            <meshStandardMaterial 
              color="#ff4444"
              emissive="#ff0000"
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Watch strap with animation
function WatchStrap({
  color,
  material,
  isSwapping,
}: {
  color: string;
  material: string;
  isSwapping: boolean;
}) {
  const topRef = useRef<THREE.Group>(null);
  const bottomRef = useRef<THREE.Group>(null);
  const swapProgress = useRef(0);

  useFrame((_, delta) => {
    if (isSwapping) {
      swapProgress.current = Math.min(1, swapProgress.current + delta * 3);
    } else {
      swapProgress.current = Math.max(0, swapProgress.current - delta * 3);
    }

    const bounce = Math.sin(swapProgress.current * Math.PI) * 0.3;

    if (topRef.current) {
      topRef.current.position.y = bounce * 0.15;
      topRef.current.rotation.x = bounce * 0.08;
    }
    if (bottomRef.current) {
      bottomRef.current.position.y = -bounce * 0.15;
      bottomRef.current.rotation.x = -bounce * 0.08;
    }
  });

  const getStrapMaterial = () => {
    switch (material) {
      case 'rubber':
        return { roughness: 0.7, metalness: 0.0 };
      case 'metal':
        return { roughness: 0.15, metalness: 0.95 };
      case 'fabric':
        return { roughness: 0.9, metalness: 0.0 };
      case 'leather':
      default:
        return { roughness: 0.6, metalness: 0.0 };
    }
  };

  const strapProps = getStrapMaterial();

  return (
    <group>
      {/* Top strap - starts from lugs at y=1.2 */}
      <group ref={topRef}>
        {/* Spring bar (connecting piece) */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Main strap segment 1 - attached to lugs */}
        <mesh position={[0, 1.575, -0.02]} castShadow>
          <boxGeometry args={[0.52, 0.75, 0.1]} />
          <meshStandardMaterial
            color={color}
            roughness={strapProps.roughness}
            metalness={strapProps.metalness}
          />
        </mesh>
        {/* Main strap segment 2 - curves back */}
        <mesh position={[0, 2.05, -0.15]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.09]} />
          <meshStandardMaterial
            color={color}
            roughness={strapProps.roughness}
            metalness={strapProps.metalness}
          />
        </mesh>
        {/* Strap texture lines for leather */}
        {material === 'leather' && (
          <>
            {[1.35, 1.55, 1.75].map((y, i) => (
              <mesh key={i} position={[0, y, 0.04]}>
                <boxGeometry args={[0.48, 0.005, 0.01]} />
                <meshStandardMaterial color="#000000" roughness={0.9} transparent opacity={0.3} />
              </mesh>
            ))}
          </>
        )}
        {/* Buckle */}
        <mesh position={[0, 2.22, -0.28]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.35, 0.12, 0.04]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Bottom strap - starts from lugs at y=-1.2 */}
      <group ref={bottomRef}>
        {/* Spring bar (connecting piece) */}
        <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Main strap segment 1 - attached to lugs */}
        <mesh position={[0, -1.575, -0.02]} castShadow>
          <boxGeometry args={[0.52, 0.75, 0.1]} />
          <meshStandardMaterial
            color={color}
            roughness={strapProps.roughness}
            metalness={strapProps.metalness}
          />
        </mesh>
        {/* Main strap segment 2 - curves back */}
        <mesh position={[0, -2.05, -0.15]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.09]} />
          <meshStandardMaterial
            color={color}
            roughness={strapProps.roughness}
            metalness={strapProps.metalness}
          />
        </mesh>
        {/* Strap holes for leather */}
        {material === 'leather' && (
          <>
            {[-1.35, -1.5, -1.65, -1.8].map((y, i) => (
              <mesh key={i} position={[0, y, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                <meshStandardMaterial color="#000000" />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
}

// Main Watch Model
export default function WatchModel({ config, isSwapping }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const caseProps = getCaseMaterialProps(config.caseMaterial, config.caseColor);

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Watch Case - main body */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.35, 64]} />
        <meshStandardMaterial
          color={caseProps.color}
          metalness={caseProps.metalness}
          roughness={caseProps.roughness}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Case middle ring (bezel) */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.05, 0.06, 16, 64]} />
        <meshStandardMaterial
          color={caseProps.color}
          metalness={caseProps.metalness}
          roughness={caseProps.roughness * 0.5}
          envMapIntensity={2}
        />
      </mesh>

      {/* Bezel top ring */}
      <mesh position={[0, 0, 0.21]} castShadow>
        <torusGeometry args={[1.0, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={caseProps.color}
          metalness={1}
          roughness={0.05}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Watch dial (face) */}
      <mesh position={[0, 0, 0.175]} receiveShadow>
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial
          color={config.dialColor}
          metalness={config.dialStyle === 'sunburst' ? 0.4 : 0.1}
          roughness={config.dialStyle === 'matte' ? 0.9 : config.dialStyle === 'carbon' ? 0.3 : 0.3}
          envMapIntensity={config.dialStyle === 'sunburst' ? 1.5 : 0.5}
          emissive={config.dialColor}
          emissiveIntensity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sunburst pattern overlay */}
      {config.dialStyle === 'sunburst' && (
        <mesh position={[0, 0, 0.176]}>
          <circleGeometry args={[0.94, 64]} />
          <meshStandardMaterial
            color={config.dialColor}
            metalness={0.6}
            roughness={0.15}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Guilloche pattern */}
      {config.dialStyle === 'guilloche' && (
        <group position={[0, 0, 0.176]}>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
              <ringGeometry args={[0.2 + i * 0.09, 0.22 + i * 0.09, 64]} />
              <meshStandardMaterial
                color={config.dialColor}
                metalness={0.5}
                roughness={0.2}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Carbon fiber pattern */}
      {config.dialStyle === 'carbon' && (
        <group position={[0, 0, 0.176]}>
          {Array.from({ length: 20 }, (_, i) => (
            <mesh key={i} position={[(i % 5 - 2) * 0.2, (Math.floor(i / 5) - 2) * 0.2, 0]}>
              <planeGeometry args={[0.18, 0.18]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#1a1a1a' : '#222222'}
                metalness={0.3}
                roughness={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Crystal / Glass */}
      <mesh position={[0, 0, 0.21]}>
        <circleGeometry args={[0.98, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={0.95}
          thickness={0.1}
          transparent
          opacity={0.05}
          envMapIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hour markers */}
      <HourMarkers dialColor={config.dialColor} />

      {/* Watch hands */}
      <WatchHands color={config.handColor} style={config.handStyle} />

      {/* Complications */}
      <Complication
        position={[0.5, 0, 0.185]}
        type="date"
        visible={config.showDate}
      />
      <Complication
        position={[0, 0.45, 0.185]}
        type="chrono"
        visible={config.showChronograph}
      />
      <Complication
        position={[0, -0.45, 0.185]}
        type="moonphase"
        visible={config.showMoonphase}
      />

      {/* Crown */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
        <meshStandardMaterial
          color={caseProps.color}
          metalness={caseProps.metalness}
          roughness={0.2}
        />
      </mesh>

      {/* Crown grip lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              1.2,
              Math.cos(angle) * 0.09,
              Math.sin(angle) * 0.09,
            ]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.18, 0.005, 0.005]} />
            <meshStandardMaterial color={caseProps.color} metalness={1} roughness={0.05} />
          </mesh>
        );
      })}

      {/* Lugs */}
      {[
        [0.35, 1.05, 0],
        [-0.35, 1.05, 0],
        [0.35, -1.05, 0],
        [-0.35, -1.05, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.25]} />
          <meshStandardMaterial
            color={caseProps.color}
            metalness={caseProps.metalness}
            roughness={caseProps.roughness}
          />
        </mesh>
      ))}

      {/* Strap */}
      <WatchStrap
        color={config.strapColor}
        material={config.strapMaterial}
        isSwapping={isSwapping}
      />

      {/* Case back */}
      <mesh position={[0, 0, -0.18]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[1.02, 64]} />
        <meshStandardMaterial
          color={caseProps.color}
          metalness={caseProps.metalness}
          roughness={caseProps.roughness}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
