import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Normalizes the vertices of the input geometry to create a sphere geometry.
 * @param {THREE.BufferGeometry} geometry - The input geometry.
 * @param {number} radius - The radius of the resulting sphere.
 * @returns {THREE.BufferGeometry} - The sphere geometry with normalized vertices.
 */
export function useNormalizeVerticesToSphere(geometry, radius) {


    function vertexToLatLng(vertex) {
        const lat = Math.asin(vertex.y / -vertex.length()) * (180 / Math.PI);
        const lng = Math.atan2(vertex.z, -vertex.x) * (180 / Math.PI);

        return { lat, lng };
    }

    function betterNormalise(v) {
        let x2 = v.x * v.x;
        let y2 = v.y * v.y;
        let z2 = v.z * v.z;
        let x = v.x * Math.sqrt(1 - (y2 + z2) / 2 + (y2 * z2) / 3);
        let y = v.y * Math.sqrt(1 - (z2 + x2) / 2 + (z2 * x2) / 3);
        let z = v.z * Math.sqrt(1 - (x2 + y2) / 2 + (x2 * y2) / 3);

        return new THREE.Vector3(x, y, z);
    }

    const normalizedGeometry = useMemo(() => {
        if (!geometry) return;

        const newGeometry = geometry.clone();

        const positionAttribute = newGeometry.getAttribute('position');
        const vertexCount = positionAttribute.count;
        const latLngs = [];

        for (let i = 0; i < vertexCount; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute,i);
            const latLng = vertexToLatLng(vertex);
            latLngs.push(latLng.lat, latLng.lng);

            let normalizedVertex = betterNormalise(vertex);
            const scaleFactor = radius / normalizedVertex.length();
            normalizedVertex.multiplyScalar(scaleFactor);

            positionAttribute.setXYZ(
                i,
                normalizedVertex.x,
                normalizedVertex.y,
                normalizedVertex.z,
            );
        }
        newGeometry.setAttribute(
            'latLng',
            new THREE.Float32BufferAttribute(latLngs, 2),
        );
        newGeometry.computeVertexNormals();

        return newGeometry;
    }, [geometry, radius]);

    return normalizedGeometry;
}
