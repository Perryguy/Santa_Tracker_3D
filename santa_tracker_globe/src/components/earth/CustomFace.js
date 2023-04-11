/* eslint-disable react/no-unknown-property */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGenerateCubeSide } from '../../hooks/useGenerateCubeSide';

const CustomFace = ({ normal, material, radius, resolution }) => {
    const geometry = useMemo(() => {
        const size = 1;
        const halfSize = size / 2;
        const step = size / resolution;

        const u = new THREE.Vector3()
            .crossVectors(normal, new THREE.Vector3(1, 0, 0))
            .normalize();
        if (u.length() < 0.5) {
            u.crossVectors(normal, new THREE.Vector3(0, 1, 0)).normalize();
        }
        const v = new THREE.Vector3().crossVectors(normal, u).normalize();

        const vertices = [];
        const indices = [];

        for (let i = 0; i <= resolution; i++) {
            for (let j = 0; j <= resolution; j++) {
                const x = i * step - halfSize;
                const y = j * step - halfSize;
                const point = new THREE.Vector3()
                    .copy(normal)
                    .multiplyScalar(halfSize)
                    .addScaledVector(u, x)
                    .addScaledVector(v, y);
                vertices.push(point.x, point.y, point.z);

                if (i < resolution && j < resolution) {
                    const a = i * (resolution + 1) + j;
                    const b = a + resolution + 1;
                    indices.push(a, b, a + 1);
                    indices.push(b, b + 1, a + 1);
                }
            }
        }

        const bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3),
        );
        bufferGeometry.setIndex(indices);
        bufferGeometry.computeVertexNormals();
        bufferGeometry.scale(radius, radius, radius);

        return bufferGeometry;
    }, [normal, resolution, radius]);

    return <mesh geometry={geometry} material={material} />;
};

export default CustomFace;
