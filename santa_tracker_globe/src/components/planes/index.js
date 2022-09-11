/* eslint-disable react/no-unknown-property */
import { useThree, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { usePlane } from '@react-three/cannon';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import React, { useState} from 'react';

function Planes({position, size, resolution, ...props}){
    const { gl } = useThree();

    const [ cameraPosition, planes, addPlane, worldConstants] = useStore((state)=> [
        state.cameraPosition,
        state.planes,
        state.addPlane,
        state.worldConstants,
    ]);

    function _Key(xc, zc) {
        return xc + '/' + zc;
    }

    // Handles whether the camera is in or out of the chunk
    function CellIndex(p) {
        const xp = p.x + worldConstants.MIN_CELL_SIZE * 0.5;
        const yp = p.y + worldConstants.MIN_CELL_SIZE * 0.5;
        const x = Math.floor(xp / worldConstants.MIN_CELL_SIZE);
        const z = Math.floor(yp / worldConstants.MIN_CELL_SIZE);
        return [x, z];
    }

    useFrame((state) => {
        size = [500,500];
        resolution = [64,64];
        const [x , y] = CellIndex(cameraPosition);
        const newChunkKey = _Key(x, y);
        if (newChunkKey in planes) {
            return;
        }
        // console.log(newChunkKey);
        const offset = new THREE.Vector2(x * worldConstants.MIN_CELL_SIZE, y * worldConstants.MIN_CELL_SIZE,);  
        // console.log(newChunkKey, offset.x, offset.y, size, resolution );
        addPlane(newChunkKey, offset.x, offset.y, resolution, size );
    });

    gl.shadowMap.enabled = true;
    const [ ref ] = usePlane(() => ({
        type: 'Static',
        position: position,
        ...props
    }));
    // softShadows();


    return(
        <>
            <mesh  ref={ref}>
                <meshPhongMaterial color={'red'} attach="material" />
                <planeBufferGeometry attach='geometry' args={[size[0], size[1], resolution[0], resolution[1]]} />
            </mesh>
        </>
    );
}
export default Planes;