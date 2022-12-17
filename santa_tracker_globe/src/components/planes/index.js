/* eslint-disable react/no-unknown-property */
import { useThree, useFrame } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import React from 'react';

import { DictIntersection, DictDifference } from '../../Utilities/dictionaryUtils';

function Planes({position, size, resolution, ...props}){
    const { gl } = useThree();

    const [ cameraPosition, planes, addPlane, quadTreeRoot, setQuadTreeRoot, worldConstants] = useStore((state)=> [
        state.cameraPosition,
        state.planes,
        state.addPlane,
        state.quadTreeRoot,
        state.setQuadTreeRoot,
        state.worldConstants,
    ]);

    function Key(c) {
        return c.position[0] + '/' + c.position[1] + ' [' + c.dimensions[0] + ']';
    }

    // Handles whether the camera is in or out of the chunk
    function CellIndex(p) {
        const xp = p.x + worldConstants.MIN_CELL_SIZE * 0.5;
        const yp = p.y + worldConstants.MIN_CELL_SIZE * 0.5;
        const x = Math.floor(xp / worldConstants.MIN_CELL_SIZE);
        const z = Math.floor(yp / worldConstants.MIN_CELL_SIZE);
        return [x, z];
    }

    // Quad Tree implementation

    function Insert(CameraPositionXY) {
        InternalInsert(quadTreeRoot, CameraPositionXY);
    }

    function InternalInsert(child, CameraPositionXY) {
        const distToChild = InternalDistanceToChild(child, CameraPositionXY);

        if (distToChild == null){
            console.log(true);
            return;
        }

        if (distToChild < child.size.x && child.size.x > 500) {
            child.children = InternalCreateChildren(child);
            console.log(child.children);
            
            for (let c of child.children) {
                InternalInsert(c, CameraPositionXY);
            }
        }
    }

    function InternalDistanceToChild(child, CameraPositionXY) {
        return child.center?.distanceTo(CameraPositionXY);
    }

    function GetChildren() {
        const children = [];
        InternalGetChildren(quadTreeRoot, children);
        return children;
     
    }

    function InternalGetChildren(node, target) {
        if (node.children.length === 0) {
            target.push(node);
            return;
        }
        for (let c of node.children) {
            return InternalGetChildren(c, target);
        } 
    }
      
    function InternalCreateChildren(child){
    
        const midpoint = child.bounds.getCenter(new THREE.Vector2());
    
        // Bottom left
        const b1 = new THREE.Box2(child.bounds.min, midpoint);
    
        // Bottom right
        const b2 = new THREE.Box2(
            new THREE.Vector2(midpoint.x, child.bounds.min.y),
            new THREE.Vector2(child.bounds.max.x, midpoint.y));
    
        // Top left
        const b3 = new THREE.Box2(
            new THREE.Vector2(child.bounds.min.x, midpoint.y),
            new THREE.Vector2(midpoint.x, child.bounds.max.y));
    
        // Top right
        const b4 = new THREE.Box2(midpoint, child.bounds.max);
    
        const children = [b1, b2, b3, b4].map(
            b => {
                return {
                    bounds: b,
                    children: [],
                    center: b.getCenter(new THREE.Vector2()),
                    size: b.getSize(new THREE.Vector2())
                };
            });
        return children;
    }


    function UpdateVisibleChunk(){
        const bounds = new THREE.Box2(new THREE.Vector2(-2500,-2500), new THREE.Vector2(2500, 2500));
        const CameraPositionXY = new THREE.Vector2(cameraPosition.x, cameraPosition.y);
        setQuadTreeRoot(bounds, [], bounds.getCenter(new THREE.Vector2()), bounds.getSize(new THREE.Vector2()));
    

        Insert(CameraPositionXY);

        // eslint-disable-next-line no-constant-condition
        // if(true){
        //     return;
        // }

        const children = GetChildren();

        let newTerrainChunks = {};
        const center = new THREE.Vector2();
        const dimensions = new THREE.Vector2();

        for (let c of children) {
            c.bounds.getCenter(center);
            c.bounds.getSize(dimensions);
    
            const child = {
                position: [center.x, center.y],
                bounds: c.bounds,
                dimensions: [dimensions.x, dimensions.y],
            };
    
            const k = Key(child);
            // console.log(k);

            newTerrainChunks[k] = child;

        }


        const intersection = DictIntersection(planes, newTerrainChunks);
        const difference = DictDifference(newTerrainChunks, planes);
        const recycle = Object.values(DictDifference(planes, newTerrainChunks));

        newTerrainChunks = intersection;

        for (let ChunkKey in difference) {
            const [xp, yp] = difference[ChunkKey].position;
            const offset = new THREE.Vector2(xp , yp );  

            // addPlane(ChunkKey, offset.x, offset.y, resolution, difference[ChunkKey].dimensions[0] );
        }   
        
    }
    
    useFrame((state) => {
        UpdateVisibleChunk();
       
    });

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