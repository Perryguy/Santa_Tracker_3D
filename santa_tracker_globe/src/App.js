/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Orbit from './components/fakePlayer/FakePlayer';
import TargetObject from './components/planet/Planet';
import PlayerCamera from './components/playerCamera/PlayerCamera';
import { OrbitControls } from '@react-three/drei';
import { useStore } from './hooks/store';
import { height_map_generator } from './components/planet/terrain/HeightMapGenerator';
import imageData from './assets/textures/output_file.npy';

import './App.css';

function App() {
    const isLocked = useRef(false);
    const targetObjectRef = useRef();
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const setHeightGenerator = useStore((state) => state.setHeightGenerator);

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
        });
    }

    useEffect(() => {
        async function loadAssets() {
            try {
                const response = await fetch(imageData);
                const arrayBuffer = await response.arrayBuffer();
                const heightData = new Float32Array(arrayBuffer);
                const heightGenerator = new height_map_generator.HeightMapGenerator(heightData);
                setHeightGenerator(heightGenerator);

                setAssetsLoaded(true); // Set assetsLoaded to true when assets are loaded
            } catch (error) {
                console.error('Error loading assets:', error);
            }
        }
        loadAssets();
    }, []);

    return (
        <div className="App">
            {assetsLoaded ? (
                <Canvas
                    id="canvasId"
                    shadows
                    gl={{ alpha: false }}
                    camera={{ fov: 90, far: 9000, position: (0, 0, 600) }}
                    raycaster={{
                        computeOffsets: (_, { size: { width, height } }) => {
                            if (isLocked.current) {
                                return {
                                    offsetX: width / 2,
                                    offsetY: height / 2,
                                };
                            } else {
                                return null;
                            }
                        },
                    }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <directionalLight
                            castShadow
                            position={[2.5, 8, 5]}
                            intensity={1.0}
                            shadow-mapSize-width={7680}
                            shadow-mapSize-height={4320}
                            shadow-camera-far={50}
                            shadow-camera-left={-10}
                            shadow-camera-right={10}
                            shadow-camera-top={10}
                            shadow-camera-bottom={-10}
                        />
                        {/* <PlayerCamera targetObject={targetObjectRef}/> */}
                        <TargetObject />
                        <Orbit />
                        <OrbitControls
                            enableZoom={true}
                            enableRotate={true}
                            rotateSpeed={0.4}
                            panSpeed={0.5}
                            zoomSpeed={1}
                        />
                    </Suspense>
                </Canvas>
            ) : (
                <div>Loading assets, please wait...</div>
            )}
        </div>
    );
}

export default App;
