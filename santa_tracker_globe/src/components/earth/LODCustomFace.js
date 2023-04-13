import React from 'react';
import { useFrame } from '@react-three/fiber'; // or 'react-three-fiber'
import CustomFace from './CustomFace';
import * as THREE from 'three';

function calculateSubdividedNormals(normal) {
    const baseVectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1),
    ];

    const subdivisions = baseVectors.map((baseVector) =>
        new THREE.Vector3().crossVectors(normal, baseVector).normalize(),
    );

    return subdivisions.reduce((result, subNormal, index, array) => {
        if (index < array.length - 1) {
            const nextSubNormal = array[index + 1];
            const subdividedNormal = new THREE.Vector3()
                .addVectors(subNormal, nextSubNormal)
                .normalize();
            result.push(subdividedNormal);
        }
        return result;
    }, []);
}
const LODCustomFace = ({
    normal,
    material,
    radius,
    resolution,
    maxDepth,
    lodDistance,
    depth = 0,
}) => {
    const [subdivided, setSubdivided] = React.useState(false);
    const meshRef = React.useRef();

    useFrame(({ camera }) => {
        if (depth >= maxDepth) return;

        const mesh = meshRef.current;
        if (!mesh) return;

        const distance = mesh.position.distanceTo(camera.position);
        if (distance < lodDistance && !subdivided) {
            setSubdivided(true);
        } else if (distance >= lodDistance && subdivided) {
            setSubdivided(false);
        }
    });

    if (subdivided) {
        // Calculate new normals for subdivided faces based on the current normal
        const normals = calculateSubdividedNormals(normal);

        return (
            <>
                {normals.map((subNormal, index) => (
                    <LODCustomFace
                        key={index}
                        normal={subNormal}
                        material={material}
                        radius={radius}
                        resolution={resolution / 2}
                        maxDepth={maxDepth}
                        lodDistance={lodDistance}
                        depth={depth + 1}
                    />
                ))}
            </>
        );
    }

    return (
        <CustomFace
            ref={meshRef}
            normal={normal}
            material={material}
            radius={radius}
            resolution={resolution}
            children={null}
        />
    );
};

export default LODCustomFace;
