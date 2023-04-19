import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { getState, useStore } from '../../hooks/store';
import useQuadTree from './hooks/useQuadTree';

const TargetObject = () => {
    const { scene } = useThree();
    const debugCameraPosition = useRef(
        getState((state) => state.debugCameraPosition),
    );
    const groups = useStore((state) => state.groups);
    const updateGroupMatrix = useStore((state) => state.updateGroupMatrix);
    const setGroupMatrixAutoUpdate = useStore(
        (state) => state.setGroupMatrixAutoUpdate,
    );
    const replaceChunks = useStore((state) => state.replaceChunks);
    const chunks = useStore((state) => state.chunks);
    const TerrainRebuilder = useStore((state) => state.builder);

    useEffect(() => {
        // Initialize the quadtree
        useStore.subscribe(
            (state) =>
                (debugCameraPosition.current = state.debugCameraPosition),
        );
    }, []);

    useEffect(() => {
        // Add groups to the scene
        groups.forEach((group) => scene.add(group));
        // Remove groups from the scene when the component is unmounted
        return () => groups.forEach((group) => scene.remove(group));
    }, [scene, groups]);

    const updateVisibleChunksQuadtree = useQuadTree(
        debugCameraPosition,
        TerrainRebuilder,
        groups,
        updateGroupMatrix,
        setGroupMatrixAutoUpdate,
        replaceChunks,
        chunks,
    );

    const update = () => {
        TerrainRebuilder.Update();
        if (!TerrainRebuilder.Busy) {
            updateVisibleChunksQuadtree();
        }
    };

    useFrame(update);

    return null;
};

export default TargetObject;
