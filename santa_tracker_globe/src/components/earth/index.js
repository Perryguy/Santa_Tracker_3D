/* eslint-disable react/no-unknown-property */
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CustomFace from './CustomFace';
import React, { useRef } from 'react';

// import EarthNormalMap from '../../assets/textures/nomalmap.png';
// import EarthDayMap from '../../assets/textures/daymap.jpg';
// import EarthSpecularMap from '../../assets/textures/specularmap.jpg';
// import Test from '../../assets/textures/gebco_bathy.5400x2700_8bit.jpg';

function Earth(props) {
    const meshRef = useRef();
    const resolution = 200; // Adjust this value to change the level of detail.
    const radius = 6.371; // Desired radius for the sphere.

    const normals = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
    ];

    const material = new THREE.MeshPhongMaterial({ color: 0x777777, wireframe: false, flatShading: false });

    return (
        <group>
            {normals.map((normal, index) => (
                <CustomFace
                    key={index}
                    normal={normal}
                    material={material}
                    radius={radius}
                    resolution={resolution}
                />
            ))}
        </group>
    );
}

export default Earth;
