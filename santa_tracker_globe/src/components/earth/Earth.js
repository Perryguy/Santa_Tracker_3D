import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { getState, useStore } from '../../hooks/store';
import { utils } from './utils';
import { terrain_chunk } from './TerrainChunk';

const TargetObject = (props) => {
    const meshRef = useRef();
    const resolution = 200; // Adjust this value to change the level of detail.
    const radius = 637.1; // Desired radius for the sphere.
    const debugCameraPosition = useRef(
        getState((state) => state.debugCameraPosition),
    );
    const { scene } = useThree();

    const initializeQuadtree = useStore((state) => state.initializeQuadtree);
    const quadTree = useStore((state) => state.cubeQuadTree);
    const groups = useStore((state) => state.groups);
    const updateGroupMatrix = useStore((state) => state.updateGroupMatrix);
    const setGroupMatrixAutoUpdate = useStore(
        (state) => state.setGroupMatrixAutoUpdate,
    );
    const addToChunks = useStore((state) => state.addToChunks);
    const chunks = useStore((state) => state.chunks);
    const TerrainRebuilder = useStore((state) => state.builder);

    useEffect(() => {
        // Initialize the quadtree
        useStore.subscribe(
            (state) =>
                (debugCameraPosition.current = state.debugCameraPosition),
        );
    }, [initializeQuadtree]);

    useEffect(() => {
        // Add groups to the scene
        groups.forEach((group) => {
            scene.add(group);
        });
        const params = {
            radius: 600,
            min_node_size: 10,
        };
        initializeQuadtree(params);
        // Remove groups from the scene when the component is unmounted
        return () => {
            groups.forEach((group) => {
                scene.remove(group);
            });
        };
        
        
    }, [scene, groups, initializeQuadtree]);

    const key = (c) => {
        return `${c.position[0]}-${c.position[1]}-${c.size}-${c.index}`;
    };

    const CreateTerrainChunk = (group, offset, width, resolution) => {
        const params = {
            group: group,
            material: new THREE.MeshPhongMaterial({
                wireframe: true,
                color: 'yellow',
            }),
            width: width,
            offset: offset,
            radius: radius,
            resolution: resolution,
        };

        return TerrainRebuilder.AllocateChunk(params);
    };

    const Update = (_) => {
        TerrainRebuilder.Update();
        if (!TerrainRebuilder.Busy) {
            UpdateVisibleChunks_Quadtree();

        }
    };

    const UpdateVisibleChunks_Quadtree = () => {
        const params = {
            radius: 600,
            min_node_size: 10,
        };
        initializeQuadtree(params);
        if (quadTree) {
            quadTree.Insert(debugCameraPosition.current);
            console.log(debugCameraPosition.current);
            const sides = quadTree.GetChildren();

            let newTerrainChunks = {};
            const center = new THREE.Vector3();
            const dimensions = new THREE.Vector3();

            for (let i = 0; i < sides.length; i++) {
                updateGroupMatrix(i, sides[i].transform);
                setGroupMatrixAutoUpdate(i, false);
                for (let c of sides[i].children) {
                    c.bounds.getCenter(center);
                    c.bounds.getSize(dimensions);

                    const child = {
                        index: i,
                        group: groups[i],
                        position: [center.x, center.y, center.z],
                        bounds: quadTree.bounds,
                        size: dimensions.x,
                    };

                    const k = key(child);
                    newTerrainChunks[k] = child;
                }
            }

            const intersection = utils.DictIntersection(
                chunks,
                newTerrainChunks,
            );
            const difference = utils.DictDifference(newTerrainChunks, chunks);
            const recycle = Object.values(
                utils.DictDifference(
                    utils.DictDifference(chunks, newTerrainChunks),
                ),
            );

            TerrainRebuilder._old.push(...recycle);

            newTerrainChunks = intersection;

            for (let k in difference) {
                const [xp, yp, zp] = difference[k].position;

                const offset = new THREE.Vector3(xp, yp, zp);
                newTerrainChunks[k] = {
                    position: [xp, zp],
                    chunk: CreateTerrainChunk(
                        difference[k].group,
                        offset,
                        difference[k].size,
                        10,
                    ),
                };
            }

            addToChunks(newTerrainChunks);
            // console.log(chunks);
        }
    };

    useFrame(() => {
        Update();
    });
    
    return null;
};

export default TargetObject;
