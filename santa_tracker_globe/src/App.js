import React, { Suspense, useRef } from 'react';
import  { Canvas } from '@react-three/fiber';

import Earth from './components/earth';
import './App.css';

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
                <Earth/>
            </Suspense>
        </Canvas>
    );
}

export default App;
