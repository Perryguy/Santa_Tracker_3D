/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Stats, Sky } from '@react-three/drei';
import { useStore } from './store/useStore';
import Earth from './components/earth';
import Plane from './components/planes';
import Player from './components/playerCamera';
import ChunkManger from './components/chunkManager';

function App() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        document.addEventListener('mousemove', handleMouse);
        return () => {
            document.removeEventListener('mousemove', handleMouse);
        };
    }, []);

   
    const handleMouse = (event) => {
        const mouse = {};
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        setMousePos(mouse);
    };


    return (
        <Suspense fallback={null}>
            {/* <Earth/> */}
            <ambientLight intensity={0.6} />
            <Physics>
                <ChunkManger mousePos={mousePos} />
                <Player position={[1, 1, 1]}/>
            </Physics>
            <Sky/>
            <Stats />
        </Suspense>
    );
}

export default App;
