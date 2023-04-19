import { Vector3, Vector3 as THREE_Vector3 } from 'three';
import create from 'zustand';
import shallow from 'zustand/shallow';
import createQuadtree from '../components/earth/CreateQuadTree';
import * as THREE from 'three';
import { terrain_chunk_Rebuilder } from '../components/earth/TerrainChunkRebuilder';

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value));

const controls = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    increaseHeight: false,
    decreaseHeight: false,
    Boast: false,
    leftButton: false,
    rightButton: false,
};


export const World = (set, get) => ({
    builder: new terrain_chunk_Rebuilder.TerrainChunkRebuilder(),
    groups: [...new Array(6)].map((_) => new THREE.Group()),
    chunks: {},
    replaceChunks: (newChunks) => set({ chunks: newChunks }),
    addToGroup: (groupIndex, object) => {
        const groups = get().groups;
        groups[groupIndex].add(object);
        set({ groups });
    },
    updateGroupMatrix: (groupIndex, matrix) => {
        const groups = get().groups;
        groups[groupIndex].matrix.copy(matrix);
        groups[groupIndex].updateMatrixWorld(true);
        set({ groups });
    },
    setGroupMatrixAutoUpdate: (groupIndex, value) => {
        const groups = get().groups;
        groups[groupIndex].matrixAutoUpdate = value;
        set({ groups });
    },
});

export const player = (set) => ({
    speed: 0,
    velocity: new Vector3(0, 0, 0),
    prevVelocity: new Vector3(0, 0, 0),
    playerLocation: new Vector3(0, 0, 0),
    cameraPosition: new THREE.Vector3(),
    debugCameraPosition: new THREE.Vector3(),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    setDebugCameraPosition: (debugCameraPosition) =>
        set({ debugCameraPosition }),
});

export const playerConfig = {
    GROUND_ACCELERATION: 50,
    AIR_ACCELERATION: 20,
    JUMP_FORCE: Math.sqrt(2 * -2 * -30),
    MAX_SPRINT_SPEED: 8,
    MAX_WALK_SPEED: 6,
    MAX_AIR_SPEED: 8,
    FRICTION: 6,
};

const useStoreImpl = create((set, get) => ({
    controls,
    ...player(set),
    ...World(set, get),
    playerConfig,
    texture: 'grass',
    setTexture: (texture) => set((state) => ({ texture })),
    saveWorld: () =>
        set((state) => {
            setLocalStorage('world', state.cubes);
        }),
}));

const useStore = (sel) => useStoreImpl(sel, shallow);
Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };
