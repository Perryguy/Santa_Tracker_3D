/* eslint-disable react/no-unknown-property */

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../../hooks/store';
import { useFrame } from '@react-three/fiber';

function Sphere(props) {
    return (
        <mesh position={props.position}>
            <sphereBufferGeometry args={[10, 32, 32]} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    );
}

function Orbit() {
    const { setDebugCameraPosition, debugCameraPosition } = useStore();
    const orbitRef = useRef();
    const orbitCenter = new THREE.Vector3(0, 0, 0);
    const orbitRadius = 6400;

    useFrame((state, delta) => {
        const elapsedTime = state.clock.getElapsedTime();
        const x = Math.cos(elapsedTime * 0.01) * orbitRadius;
        const y = Math.sin(elapsedTime *0.01) * orbitRadius;
        orbitRef.current.position.set(x, y, 0);
        // orbitRef.current.rotation.y += 0.005;

        setDebugCameraPosition({
            x: x,
            y: y,
            z: 0,
        });
    });

    return (
        <group ref={orbitRef}>
            <Sphere position={[0, 0, 0]} color={'blue'} />
        </group>
    );
}

export default Orbit;
