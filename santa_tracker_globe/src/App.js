/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef } from 'react';
import  { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import {  Stats } from '@react-three/drei';
import { useStore } from './store/useStore';
import Earth from './components/earth';
import Plane from './components/planes';
import Player from './components/playerCamera';
import './App.css';
import ChunkManger from './components/chunkManager';

function App() {
    const isLocked = useRef(false);

    return (
        <Canvas
            id="canvasId" 
            shadows
            gl={{ alpha: false }}
            camera={{ fov: 90 }}
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
                {/* <Earth/> */}
                <ambientLight intensity={0.6}/>
                <Physics>
                    <ChunkManger/>
                    <Player position={[1, 1, 1]} />
                </Physics>
                <Stats/>
            </Suspense>
        </Canvas>
    );
}

export default App;
