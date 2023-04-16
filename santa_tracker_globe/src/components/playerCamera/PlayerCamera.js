/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useStore } from '../../hooks/store';

const PlayerCamera = ({ targetObject }) => {
    const { setCameraPosition } = useStore();
    const { camera, size } = useThree();
    const distance = 1900;

    useEffect(() => {
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
    }, [camera, size]);

    useFrame(() => {
        if (targetObject.current) {
            const targetPos = targetObject.current.position;
            const direction = camera.position
                .clone()
                .sub(targetPos)
                .normalize();
            const newPosition = targetPos
                .clone()
                .add(direction.multiplyScalar(distance));

            camera.position.copy(newPosition);
            camera.lookAt(targetPos);

            setCameraPosition({
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z,
            });
        }
    });

    useFrame(() => {
        if (targetObject.current) {
            camera.lookAt(targetObject.current.position);
        }
    });

    return (
        <>
            <OrbitControls
                camera={camera}
                target={
                    targetObject.current
                        ? targetObject.current.position
                        : undefined
                }
                autoRotate={false}
                enableDamping
                dampingFactor={0.1}
                rotateSpeed={0.5}
                minDistance={10}
                maxDistance={100}
                enableZoom={true}
                // maxPolarAngle={Math.PI / 2}}
                // minPolarAngle={0}
            />
        </>
    );
};

export default PlayerCamera;
