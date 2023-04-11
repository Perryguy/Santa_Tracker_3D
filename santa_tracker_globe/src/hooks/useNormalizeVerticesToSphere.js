// import { useState, useEffect } from 'react';
// import * as THREE from 'three';

// export function useNormalizeVerticesToSphere(geometry, radius) {
//     const [normalizedGeometry, setNormalizedGeometry] = useState(null);

//     useEffect(() => {
//         if (!geometry) return;

//         const newGeometry = geometry.clone();

//         const positionAttribute = geometry.getAttribute('position');
//         const vertexCount = positionAttribute.count;
//         const latLngs = [];

//         for (let i = 0; i < vertexCount; i++) {
//             const vertex = new THREE.Vector3().fromBufferAttribute(
//                 positionAttribute,
//                 i,
//             );
//             const latLng = vertexToLatLng(vertex);
//             latLngs.push(latLng.lat, latLng.lng);

//             let normalizedVertex = betterNormalise(vertex);
//             const scaleFactor = radius / normalizedVertex.length();
//             normalizedVertex.multiplyScalar(scaleFactor);

//             positionAttribute.setXYZ(
//                 i,
//                 normalizedVertex.x,
//                 normalizedVertex.y,
//                 normalizedVertex.z,
//             );
//         }
//         geometry.setAttribute(
//             'latLng',
//             new THREE.Float32BufferAttribute(latLngs, 2),
//         );
//         geometry.computeVertexNormals();

//         setNormalizedGeometry(newGeometry);
//     }, [geometry, radius]);

//     return normalizedGeometry;
// }
