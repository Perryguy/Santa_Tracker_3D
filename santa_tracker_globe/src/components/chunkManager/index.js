/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber';
import Plane from '../planes';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import React, { useEffect } from 'react';
import {
    DictDifference,
} from '../../Utilities/dictionaryUtils';

function ChunkManger() {

    const [
        cameraPosition,
        planes,
        addPlane,
        worldConstants,
    ] = useStore((state) => [
        state.cameraPosition,
        state.planes,
        state.addPlane,
        state.worldConstants,
    ]);


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



    useFrame((state) => {
        
        if (!planes){
            // Initilise a plane
            addPlane('0/0', 0, 0, worldConstants.MIN_CELL_RESOLUTION, worldConstants.MIN_CELL_SIZE); 
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

        // issues when start Cannot use 'in' operator to search for '0/0' in null;
        for (let k in difference) {
            if (k in planes) {
                continue;
            }
            const [xp, zp] = difference[k].position;

            const offset = new THREE.Vector2(xp * worldConstants.MIN_CELL_SIZE, zp * worldConstants.MIN_CELL_SIZE);

            addPlane(k, xp +offset.x, zp + offset.y, worldConstants.MIN_CELL_RESOLUTION, worldConstants.MIN_CELL_SIZE);  
        }
    });
    return (
        <>
            { planes != null &&        
        Object.keys(planes).map((key, index) => (
            <Plane
                key={index}
                position={planes[key].position}
                size={planes[key].size}
                resolution={planes[key].resolution}
            />
        ))
            }
        </>
    );
}
export default ChunkManger;
