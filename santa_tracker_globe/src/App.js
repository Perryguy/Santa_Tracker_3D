/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef } from 'react';
import  { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';

import { useStore } from './store/useStore';
import Earth from './components/earth';
import Plane from './components/planes';
import Player from './components/playerCamera';
import './App.css';

function App() {
    const isLocked = useRef(false);
    const planes = useStore((state)=> state.planes);
    Object.keys(planes).forEach( key => { 
        console.log(planes);
    });

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
                    {
                        Object.keys(planes).map((key, index) => (
                            <Plane key={index} position={planes[key].position} size={planes[key].size} resolution={planes[key].resolution}/>
                        ))
                    }
                    <Player position={[1, 1, 1]} />
                </Physics>
            </Suspense>
        </Canvas>
    );
}

export default App;
