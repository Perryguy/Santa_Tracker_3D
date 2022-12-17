/* eslint-disable react/no-unknown-property */
import { useThree, useFrame } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import Plane from '../planes';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import React from 'react';

import {
    DictIntersection,
    DictDifference,
} from '../../Utilities/dictionaryUtils';

function ChunkManger() {
    const { gl } = useThree();

    const [
        cameraPosition,
        planes,
        addPlane,
        quadTreeRoot,
        setQuadTreeRoot,
        worldConstants,
    ] = useStore((state) => [
        state.cameraPosition,
        state.planes,
        state.addPlane,
        state.quadTreeRoot,
        state.setQuadTreeRoot,
        state.worldConstants,
    ]);



    useFrame((state) => {
        function Key(xc, zc){
            return xc + '/'+ zc;
        }

        function CellIndex(px, pz) {
            const xp = px + worldConstants.MIN_CELL_SIZE * 0.5;
            const yp = pz + worldConstants.MIN_CELL_SIZE * 0.5;
            const x = Math.floor(xp / worldConstants.MIN_CELL_SIZE);
            const z = Math.floor(yp / worldConstants.MIN_CELL_SIZE);
            return [x, z];
        }

        const [xc, zc] = CellIndex(cameraPosition.x, cameraPosition.y);

        
        const keys = [];

        for (let x = -worldConstants.FIXED_GRID_SIZE; x <= worldConstants.FIXED_GRID_SIZE; x++){
            for (let z = -worldConstants.FIXED_GRID_SIZE; z<= worldConstants.FIXED_GRID_SIZE; z++){
                const k = Key(x + xc , z + zc);
                keys[k] = {
                    position: [x + xc, z + zc]
                };
            }
        }
        const difference = DictDifference(keys, planes);


        for (let k in difference) {
            if (k in planes) {
                continue;
            }

            const [xp, zp] = difference[k].position;

            const offset = new THREE.Vector2(xp * worldConstants.MIN_CELL_SIZE, zp * worldConstants.MIN_CELL_SIZE);
            // planes[k] = {
            //     position: [xc, zc],
            //     chunk: addPlane(offset, worldConstants.MIN_CELL_SIZE),
            // };
            addPlane(k, xp +offset.x, zp + offset.y, 64, worldConstants.MIN_CELL_SIZE);  
        }
    });
    return (
        <>
            {Object.keys(planes).map((key, index) => (
                <Plane
                    key={index}
                    position={planes[key].position}
                    size={planes[key].size}
                    resolution={planes[key].resolution}
                />
            ))}
        </>
    );
}
export default ChunkManger;
