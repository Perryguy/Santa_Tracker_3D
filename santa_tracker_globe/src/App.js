/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef } from 'react';
import  { Canvas } from '@react-three/fiber';
import { OrbitControls} from '@react-three/drei';
import Earth from './components/earth';
import './App.css';

function App() {
    const isLocked = useRef(false);
    return (
        <Canvas
            id="canvasId" 
            shadows
            gl={{ alpha: false }}
            camera={{ fov: 90, far: 5000, position: (0,0, 100)  }}
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
            }}>
            <Suspense fallback={null}>
                <ambientLight intensity={0.4}/>
                <directionalLight
                    castShadow
                    position={[2.5, 8, 5]}
                    intensity={1.5}
                    shadow-mapSize-width={7680}
                    shadow-mapSize-height={4320}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />
                <Earth/>
                <OrbitControls enableZoom={true} enableRotate={true} rotateSpeed={0.4} panSpeed={0.5} zoomSpeed={0.6}/>
            </Suspense>
        </Canvas>
    );
}

export default App;
