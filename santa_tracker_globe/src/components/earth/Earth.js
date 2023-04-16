/* eslint-disable react/no-unknown-property */
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CustomFace from './CustomFace';
import React, { useRef, forwardRef } from 'react';

// import EarthNormalMap from '../../assets/textures/nomalmap.png';
// import EarthDayMap from '../../assets/textures/daymap.jpg';
// import EarthSpecularMap from '../../assets/textures/specularmap.jpg';
// import Test from '../../assets/textures/gebco_bathy.5400x2700_8bit.jpg';

const TargetObject = forwardRef((props, ref) => {
    const meshRef = useRef();
    const resolution = 200; // Adjust this value to change the level of detail.
    const radius = 637.1; // Desired radius for the sphere.

    const normals = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
    ];

    const materials = [
        new THREE.MeshPhongMaterial({
            color: 'blue',
            wireframe: false,
            flatShading: false,
        }),
        new THREE.MeshPhongMaterial({
            color: 'red',
            wireframe: false,
            flatShading: false,
        }),
        new THREE.MeshPhongMaterial({
            color: 'white',
            wireframe: false,
            flatShading: false,
        }),
        new THREE.MeshPhongMaterial({
            color: 'green',
            wireframe: false,
            flatShading: false,
        }),
        new THREE.MeshPhongMaterial({
            color: 'orange',
            wireframe: false,
            flatShading: false,
        }),
        new THREE.MeshPhongMaterial({
            color: 'yellow',
            wireframe: false,
            flatShading: false,
        })
    ];

    const material = new THREE.MeshPhongMaterial({
        color: 0x777777,
        wireframe: true,
        flatShading: false,
    });

    return (
        <group ref={ref}>
            {normals.map(
                (normal, index) => (
                    (
                        <CustomFace
                            key={index}
                            normal={normal}
                            material={materials[index]}
                            radius={radius}
                            resolution={resolution}
                        />
                    )
                ),
            )}
        </group>
    );
});
TargetObject.displayName = 'TargetObject';
export default TargetObject;

// export default Earth;
