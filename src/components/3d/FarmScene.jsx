import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, OrbitControls, ContactShadows, Cloud, Instance, Instances } from '@react-three/drei';
import { useFarmStore } from '../../store/useFarmStore';
import * as THREE from 'three';

const Terrain = ({ soilType, area }) => {
    const color = useMemo(() => {
        switch (soilType) {
            case 'black': return '#3B2F2F';
            case 'red': return '#8B4513';
            case 'sandy': return '#E6C288';
            case 'clay': return '#A0522D';
            default: return '#5D4037';
        }
    }, [soilType]);

    const scale = Math.min(Math.max(area / 2, 5), 30);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
            <planeGeometry args={[scale * 3, scale * 3, 64, 64]} />
            <meshStandardMaterial
                color={color}
                roughness={0.9}
                displacementScale={0.5}
            />
        </mesh>
    );
};

// --- PROCEDURAL 3D MODELS ---

// 1. CEREALS (Wheat, Rice) - Tubers/Grass like
const CerealGeometry = ({ stage, color, headColor, isWilted, isDamaged, windTime, position }) => {
    const stemColor = isWilted ? '#C2B280' : isDamaged ? '#8B4513' : (stage === 4 ? '#E6C288' : (color || '#2F855A')); // Green to Gold
    const finalHeadColor = isWilted ? '#D4C4A8' : isDamaged ? '#A0522D' : (stage >= 3 ? (headColor || '#FFD700') : (color || '#48BB78')); // Green to Gold

    const height = stage * 0.4;
    const thickness = 0.05 * (stage * 0.5 + 0.5);
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            const angle = Math.sin(windTime + position[0]) * (0.1 + stage * 0.05);
            groupRef.current.rotation.z = angle;
        }
    });

    if (stage === 0) return null;

    return (
        <group ref={groupRef} position={position}>
            {/* Stem */}
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[thickness, thickness, height, 5]} />
                <meshStandardMaterial color={stemColor} />
            </mesh>
            {/* Leaves */}
            {stage >= 2 && (
                <>
                    <mesh position={[0, height * 0.5, 0]} rotation={[0, 0, 0.5]}>
                        <cylinderGeometry args={[0.01, 0.03, height * 0.6, 3]} />
                        <meshStandardMaterial color={stemColor} />
                    </mesh>
                    <mesh position={[0, height * 0.3, 0]} rotation={[0, 0, -0.5]}>
                        <cylinderGeometry args={[0.01, 0.03, height * 0.6, 3]} />
                        <meshStandardMaterial color={stemColor} />
                    </mesh>
                </>
            )}
            {/* Heads (Grain) */}
            {stage >= 3 && (
                <mesh position={[0, height, 0]}>
                    <capsuleGeometry args={[thickness * 1.5, 0.3, 4, 8]} />
                    <meshStandardMaterial color={finalHeadColor} />
                </mesh>
            )}
        </group>
    );
};

// 2. TALL CROPS (Maize)
const MaizeGeometry = ({ stage, isWilted, isDamaged, windTime, position }) => {
    const height = stage * 0.6; // Taller
    const color = isWilted ? '#C2B280' : isDamaged ? '#8B4513' : '#2F855A';
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) groupRef.current.rotation.z = Math.sin(windTime + position[0]) * 0.05;
    });

    if (stage === 0) return null;

    return (
        <group ref={groupRef} position={position}>
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.08, 0.06, height, 5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Broad Leaves */}
            {stage >= 2 && [-0.5, 0.5, 1, -1].map((rot, i) => (
                <mesh key={i} position={[0, height * (0.2 * (i + 1)), 0]} rotation={[0, rot, 0.5 * Math.sign(rot)]}>
                    <boxGeometry args={[0.02, height * 0.5, 0.15]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            ))}
            {/* Corn Cobs */}
            {stage >= 3 && (
                <mesh position={[0.1, height * 0.6, 0]} rotation={[0, 0, -0.3]}>
                    <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
                    <meshStandardMaterial color="#F6E05E" />
                </mesh>
            )}
        </group>
    );
};

// 3. BUSH CROPS (Cotton, Chilli, Tomato)
const BushGeometry = ({ type, stage, isWilted, isDamaged, windTime, position }) => {
    const scale = stage * 0.3;
    const color = isWilted ? '#8B4513' : isDamaged ? '#A0522D' : '#276749'; // Darker green

    // Fruit settings
    let fruitColor = 'red';
    let fruitSize = 0.08;
    if (type === 'cotton') { fruitColor = 'white'; fruitSize = 0.12; }
    if (type === 'chilli') { fruitColor = '#C53030'; fruitSize = 0.05; } // Red long

    const groupRef = useRef();
    useFrame(() => {
        if (groupRef.current) groupRef.current.rotation.x = Math.sin(windTime * 2 + position[2]) * 0.02;
    });

    if (stage === 0) return null;

    return (
        <group ref={groupRef} position={position}>
            {/* Main Bush Body */}
            <mesh position={[0, scale, 0]}>
                <dodecahedronGeometry args={[scale, 0]} />
                <meshStandardMaterial color={color} flatShading />
            </mesh>

            {/* Fruits/Flowers */}
            {stage >= 3 && [-0.2, 0, 0.2].map((off, i) => (
                <mesh key={i} position={[off, scale + 0.1, (Math.random() - 0.5) * 0.2]}>
                    {type === 'chilli' ? (
                        <capsuleGeometry args={[0.02, 0.15, 4, 8]} />
                    ) : (
                        <sphereGeometry args={[fruitSize, 8, 8]} />
                    )}
                    <meshStandardMaterial color={stage === 4 ? fruitColor : 'green'} />
                </mesh>
            ))}
        </group>
    );
};

// 4. ROOT CROPS (Onion, Carrot, Ginger, Beetroot)
const RootCropGeometry = ({ type, stage, isWilted, windTime, position }) => {
    // Only show foliage above ground
    const height = stage * 0.3;
    const color = isWilted ? '#A0522D' : '#48BB78';

    // Root peek color
    let rootColor = '#ecc94b'; // Onion
    if (type === 'carrot') rootColor = '#ed8936';
    if (type === 'beetroot') rootColor = '#9b2c2c';
    if (type === 'ginger') rootColor = '#d69e2e';

    if (stage === 0) return null;

    return (
        <group position={position}>
            {/* Foliage Bunch */}
            <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.15, 0.02, height, 4]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Root peeking out at harvest */}
            {stage === 4 && (
                <mesh position={[0, 0.05, 0]}>
                    <sphereGeometry args={[0.1, 8, 6]} />
                    <meshStandardMaterial color={rootColor} />
                </mesh>
            )}
        </group>
    );
};

const CropGeometrySelector = (props) => {
    const { type } = props;
    if (type === 'maize') return <MaizeGeometry {...props} />;
    if (['cotton', 'chilli', 'tomato'].includes(type)) return <BushGeometry {...props} />;
    if (['onion', 'carrot', 'ginger', 'beetroot'].includes(type)) return <RootCropGeometry {...props} />;

    // Default to Wheat/Rice
    const isRice = type === 'rice';
    return <CerealGeometry {...props} color={isRice ? '#48BB78' : undefined} headColor={isRice ? '#F0FFF4' : undefined} />;
};

const CropField = ({ crop, area, stage, isWilted, isDamaged }) => {
    const crops = useMemo(() => {
        const items = [];
        // Calculate field size based on area input
        const scale = Math.min(Math.max(area / 2, 5), 30);
        const size = scale * 1.4; // Cover almost the entire plane (plane is scale * 3, so radius ~1.5 scale. 1.4 is safe margin)

        // Performance limiting: Cap total items
        // More spacing for bushes, less for grass
        const spacing = ['maize', 'cotton', 'tomato'].includes(crop) ? 1.5 : 1.0;

        for (let x = -size; x < size; x += spacing) {
            for (let z = -size; z < size; z += spacing) {
                items.push([x + (Math.random() - 0.5) * 0.5, 0, z + (Math.random() - 0.5) * 0.5]);
            }
        }
        return items;
    }, [area, crop]);

    // Global wind timer
    const [windTime, setWindTime] = useState(0);
    useFrame((state) => setWindTime(state.clock.elapsedTime));

    return (
        <group>
            {crops.map((pos, idx) => (
                <CropGeometrySelector
                    key={idx}
                    type={crop}
                    position={pos}
                    stage={stage}
                    isWilted={isWilted}
                    isDamaged={isDamaged}
                    windTime={windTime}
                />
            ))}
        </group>
    );
};

// ... Particles ...
const ParticleSystem = ({ count, color, size, speed, spreadY = 20, offsetY = 0 }) => {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = Math.random() * spreadY + offsetY;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count, spreadY, offsetY]);

    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += speed;
            if (offsetY === 0) {
                ref.current.position.y = -Math.abs(Math.sin(state.clock.elapsedTime * 2) * 2);
            }
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color={color} size={size} transparent opacity={0.7} />
        </points>
    );
};

const WeatherEffects = ({ weather, visualEffects }) => {
    return (
        <>
            <Sky
                distance={450000}
                sunPosition={weather === 'rainy' ? [0, 10, -100] : [100, 20, 100]}
                turbidity={weather === 'rainy' ? 10 : 8}
                rayleigh={weather === 'sunny' ? 3 : 1}
            />
            <ambientLight intensity={weather === 'cloudy' ? 0.6 : 0.8} />
            <directionalLight
                position={[10, 20, 5]}
                intensity={weather === 'sunny' ? 1.5 : 0.8}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {(weather === 'rainy' || visualEffects.isRaining) && (
                <ParticleSystem count={1500} color="#aad3f5" size={0.1} speed={0.002} />
            )}

            {visualEffects.isSpraying && (
                <ParticleSystem count={600} color="#FFD700" size={0.15} speed={0.01} spreadY={5} offsetY={1} />
            )}

            {visualEffects.isPestControlling && (
                <ParticleSystem count={800} color="#00FF00" size={0.2} speed={0.02} spreadY={10} offsetY={2} />
            )}

            {visualEffects.isSowing && (
                <ParticleSystem count={400} color="#8B4513" size={0.12} speed={0.005} spreadY={2} offsetY={0.5} />
            )}

            {visualEffects.isTilling && (
                <ParticleSystem count={1000} color="#5D4037" size={0.2} speed={0.05} spreadY={2} offsetY={0.2} />
            )}

            {weather === 'cloudy' ? <Cloud position={[0, 10, 0]} opacity={0.5} speed={0.4} width={20} depth={5} segments={20} /> : null}
        </>
    );
};

const FarmScene = () => {
    const { farmConfig, simState, visualEffects } = useFarmStore();

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative bg-blue-100 dark:bg-gray-900">
            <Canvas shadows camera={{ position: [15, 12, 15], fov: 45 }}>
                <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={40} />
                <WeatherEffects weather={farmConfig.weather} visualEffects={visualEffects} />

                <group position={[0, 0, 0]}>
                    <Terrain soilType={farmConfig.soil} area={farmConfig.area} />
                    <CropField
                        crop={farmConfig.crop}
                        area={farmConfig.area}
                        stage={simState.stage}
                        isWilted={simState.isWilted}
                        isDamaged={simState.isDamaged}
                    />
                </group>

                <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />
            </Canvas>

            {/* Overlay Details */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white p-3 rounded-xl text-xs space-y-1 z-10 pointer-events-none">

                <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-1 mb-1">
                    <span className="font-bold">STATUS</span>
                    <span className="text-orange-400 font-bold">DAY {simState.day}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>Progress:</span>
                    <span className={`font-bold ${simState.stage === 0 ? 'text-yellow-400 animate-pulse text-[10px]' : 'text-green-400'}`}>
                        {simState.stage === 0 ? 'WAITING FOR SEEDS' : simState.stage === 4 ? 'READY' : `${(simState.growthProgress || 0).toFixed(0)}%`}
                    </span>

                    <span>Water:</span>
                    <span className={`${simState.waterLevel < 20 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                        {(simState.waterLevel || 0).toFixed(0)}%
                    </span>

                    <span>Soil Health:</span>
                    <span className={`${simState.soilHealth < 30 ? 'text-red-400' : 'text-amber-400'}`}>
                        {(simState.soilHealth || 0).toFixed(0)}%
                    </span>

                    <span>Pest Risk:</span>
                    <span className={`${simState.pestRisk > 50 ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                        {(simState.pestRisk || 0).toFixed(0)}%
                    </span>
                </div>

                {simState.stage === 4 && (
                    <div className="mt-2 text-center text-green-300 font-bold animate-pulse uppercase text-[10px] tracking-wider border border-green-500 rounded px-1">
                        Harvest Ready
                    </div>
                )}
            </div>

            {/* Visual Feedback Text */}
            {(Object.values(visualEffects).some(v => v)) && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                    <div className="bg-black/70 text-white px-6 py-3 rounded-full text-xl font-bold backdrop-blur animate-bounce whitespace-nowrap">
                        {visualEffects.isRaining && "🌧️ Watering..."}
                        {visualEffects.isSpraying && "✨ Adding Fertilizer..."}
                        {visualEffects.isPestControlling && "💨 Spraying Pesticides..."}
                        {visualEffects.isHarvesting && "🚜 Harvesting..."}
                        {visualEffects.isSowing && "🌱 Sowing Seeds..."}
                        {visualEffects.isTilling && "🚜 Tilling Soil..."}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmScene;
