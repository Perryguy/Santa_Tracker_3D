import React, { useRef }  from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import './App.css';

function App() {
    const isLocked = useRef(false);
    return (
        <div>
            <Canvas 
                shadows
                style={{ width: '100%', height: '100vh' }}
                gl={{ alpha: true }}
                // camera={{ fov: 90 }}
                raycaster={{
                    computeOffsets: (_, { size: { width, height } }) => {
                        if (isLocked.current) {
                            return {
                                offsetX: width / 2 ,
                                offsetY: height / 2,
                            };
                        } else {
                            return null;
                        }
                    },
                }}>
                <Scene />
            </Canvas>
        </div>
    );
}

export default App;
