import * as THREE from 'three';
import { height_Generator } from '../terrain/HeightGenerator';
import { useStore } from '../../../hooks/store';

const useTerrainChunkCreation = (TerrainRebuilder, radius) => {
    const { heightGenerator } = useStore();

    return (group, offset, width, resolution) => {
        // console.log(width);
        const params = {
            group,
            material: new THREE.MeshStandardMaterial({
                wireframe: true,
                color: 'yellow',
            }),
            width,
            offset,
            radius,
            resolution,
            hieghtGenerator: [
                new height_Generator.HeightGenerator(
                    heightGenerator,
                    offset,
                    100000,
                    100000,
                ),
            ],
        };

        return TerrainRebuilder.AllocateChunk(params);
    };
};

export default useTerrainChunkCreation;
