/* eslint-disable react/no-unknown-property */
import { useThree, useFrame } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import React from 'react';

import { DictIntersection, DictDifference } from '../../Utilities/dictionaryUtils';

function Planes({position, size, resolution, ...props}){

    const [worldConstants] = useStore((state)=> [
        state.worldConstants,
    ]);

    const [ ref ] = usePlane(() => ({
        type: 'Static',
        position: position,
        ...props
    }));
    
    return(
        <>
            <mesh  ref={ref}>
                <meshPhongMaterial color={'green'} attach="material" />
                <planeBufferGeometry attach='geometry' args={[worldConstants.MIN_CELL_SIZE, worldConstants.MIN_CELL_SIZE, worldConstants.MIN_CELL_RESOLUTION, worldConstants.MIN_CELL_RESOLUTION]} />
            </mesh>
        </>
    );
}
export default Planes;