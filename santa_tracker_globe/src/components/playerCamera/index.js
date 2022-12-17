/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect  } from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three'; 
import { useStore } from '../../store/useStore';


function Player({position, ...props}) {
    const defaultCamera = useThree((state) => state.camera);
    const pos = useRef([position[0], position[1], position[2]]);
    const [ setCameraPosition] = useStore((state)=> [
        state.setCameraPosition,
    ]);

    const [ref, api] = useBox(() => ({
        type: 'Kinematic',
        ...props,
    }));

    
    useEffect(
        () => api.position.subscribe((v) => (pos.current = v)),
        [api.position]
    );



    useFrame((state) => {
        setCameraPosition(defaultCamera.position);
        api.position.set(defaultCamera.position.x, defaultCamera.position.y,30);
    });

    return(
        <>
            <group>
                <mesh ref={ref}>
                    <boxBufferGeometry attach={'geometry'} args={[20,20,20]}/>
                    <meshStandardMaterial color={'white'} attach="material" />
                </mesh>
                <OrbitControls enableRotate={false}/>
            </group>
        </>
    );
}
export default Player;
