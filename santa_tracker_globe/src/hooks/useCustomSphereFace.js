import { useEffect, useState } from 'react';
import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

const useCustomSphereFace = (normal, resolution, radius) => {
    const [geometry, setGeometry] = useState(null);

    useEffect(() => {
        if (!normal || !resolution || !radius) return;

        const generateCustomSphereFace = () => {
            const faceGeometry = new BufferGeometry();
            const vertices = [];
            const indices = [];
            const size = 1;
            const halfSize = size / 2;
            const step = size / resolution;

            const u = new Vector3()
                .crossVectors(normal, new Vector3(1, 0, 0))
                .normalize();
            if (u.length() < 0.5) {
                u.crossVectors(normal, new Vector3(0, 1, 0)).normalize();
            }
            const v = new Vector3().crossVectors(normal, u).normalize();

            for (let i = 0; i <= resolution; i++) {
                for (let j = 0; j <= resolution; j++) {
                    const x = i * step - halfSize;
                    const y = j * step - halfSize;
                    const point = new Vector3()
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

            faceGeometry.setAttribute(
                'position',
                new Float32BufferAttribute(vertices, 3),
            );
            faceGeometry.setIndex(indices);
            faceGeometry.computeVertexNormals();

            return faceGeometry;
        };

        setGeometry(generateCustomSphereFace());
    }, [normal, resolution, radius]);

    return geometry;
};

export default useCustomSphereFace;
