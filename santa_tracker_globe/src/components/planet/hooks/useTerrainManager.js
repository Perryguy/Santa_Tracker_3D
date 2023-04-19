import * as THREE from 'three';
import { useState, useEffect } from 'react';
import { quadtree } from '../lod/QuadTree.js';
import { utils } from '../utils/DictionaryUtils.js';
import useTerrainChunkCreation from './useTerrainChunkCreation.js';

const MIN_CELL_SIZE = 500;
const MIN_CELL_RESOLUTION = 128; // Adjust this value to change the level of detail.
const radius = 6371; // Desired radius for the sphere.

const useTerrainManager = (
    debugCameraPosition,
    TerrainRebuilder,
    groups,
    updateGroupMatrix,
    setGroupMatrixAutoUpdate,
    replaceChunks,
    chunks,
) => {
    const key = (c) => `${c.position[0]}-${c.position[1]}-${c.size}-${c.index}`;

    const createTerrainChunk = useTerrainChunkCreation(
        TerrainRebuilder,
        radius,
    );

    const updateVisibleChunksQuadtree = () => {
        const q = new quadtree.CubeQuadTree({
            radius,
            min_node_size: MIN_CELL_SIZE,
        });
        q.Insert(debugCameraPosition.current);
        const sides = q.GetChildren();

        let newTerrainChunks = {};
        const center = new THREE.Vector3();
        const dimensions = new THREE.Vector3();

        sides.forEach((side, i) => {
            updateGroupMatrix(i, side.transform);
            setGroupMatrixAutoUpdate(i, false);

            side.children.forEach((c) => {
                c.bounds.getCenter(center);
                c.bounds.getSize(dimensions);

                const child = {
                    index: i,
                    group: groups[i],
                    position: [center.x, center.y, center.z],
                    bounds: q.bounds,
                    size: dimensions.x,
                };

                newTerrainChunks[key(child)] = child;
            });
        });

        const intersection = utils.DictIntersection(chunks, newTerrainChunks);
        const difference = utils.DictDifference(newTerrainChunks, chunks);
        const recycle = Object.values(
            utils.DictDifference(chunks, newTerrainChunks),
        );

        TerrainRebuilder._old.push(...recycle);

        newTerrainChunks = intersection;

        Object.entries(difference).forEach(([k, diff]) => {
            const [xp, yp, zp] = diff.position;
            const offset = new THREE.Vector3(xp, yp, zp);
            newTerrainChunks[k] = {
                position: [xp, zp],
                chunk: createTerrainChunk(
                    diff.group,
                    offset,
                    diff.size,
                    MIN_CELL_RESOLUTION,
                ),
            };
        });
        replaceChunks(newTerrainChunks);
    };

    return updateVisibleChunksQuadtree;
};

export default useTerrainManager;
