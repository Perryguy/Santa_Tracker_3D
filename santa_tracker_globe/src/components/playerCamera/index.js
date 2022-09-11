import React, { useRef  } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'; 
import { useStore } from '../../store/useStore';


function Player({position, ...props}) {
    const { camera } = useThree();
    const pos = useRef([position[0], position[1], position[2]]);
    const [ setCameraPosition] = useStore((state)=> [
        state.setCameraPosition,
    ]);

    const [ref] = useSphere(() => ({
        type: 'Kinematic',
        // args: [2, 1, 1], // extents: [x, y, z]
        onCollide: (e) => {},
        ...props,
    }));

    useFrame((state) => {
        setCameraPosition(camera.position);
    });

    return (
        <>
            <group>
                <mesh ref={ref}>
                </mesh>
                <OrbitControls  enableRotate={false}/>
            </group>
        </>
    );
}
export default Player;
