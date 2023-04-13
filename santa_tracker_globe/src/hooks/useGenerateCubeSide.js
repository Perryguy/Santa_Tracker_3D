import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Generates a cube face geometry based on the provided normal vector and resolution.
 * @param {THREE.Vector3} normal - The normal vector of the face.
 * @param {number} resolution - The resolution of the face (number of subdivisions).
 * @returns {THREE.BufferGeometry} - The generated cube face geometry.
 */
export function useGenerateCubeSide(normal, resolution) {

    const geometry = useMemo(() => {
        // ... your generateCubeSide logic
        
        const newGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
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

        newGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3),
        );
        newGeometry.setIndex(indices);
        newGeometry.computeVertexNormals();
        return newGeometry;
    }, [normal, resolution]);

    return geometry;
}
