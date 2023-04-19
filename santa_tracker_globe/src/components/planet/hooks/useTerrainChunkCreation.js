import * as THREE from 'three';

const useTerrainChunkCreation = (TerrainRebuilder, radius) => {
    return (group, offset, width, resolution) => {
        const params = {
            group,
            material: new THREE.MeshPhongMaterial({
                wireframe: true,
                color: 'yellow',
            }),
            width,
            offset,
            radius,
            resolution,
        };

        return TerrainRebuilder.AllocateChunk(params);
    };
};

export default useTerrainChunkCreation;
