import { Vector3 } from 'three';
import create from 'zustand';
import shallow from 'zustand/shallow';
import * as THREE from 'three';

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

export const quadTree = {
    cubeQuadTree: null,
    min_node_size: 500, //This is the size of the each face.
};



export const playerMoveInfo = {
    speed: 0,
    velocity: new Vector3(0, 0, 0),
    prevVelocity: new Vector3(0, 0, 0),
    playerLocation: new Vector3(0, 0, 0),
    cameraPosition: new THREE.Vector3(),
    // The debug camera is not a true camera but will be used to test any LOD system implementated 
    debugCameraPosition: new THREE.Vector3()

};

export const playerConfig = {
    GROUND_ACCELERATION: 50,
    AIR_ACCELERATION: 20,
    JUMP_FORCE: Math.sqrt(2 * -2 * -30), // sqrt(how high you want to jump * constant * gravity)
    MAX_SPRINT_SPEED: 8,
    MAX_WALK_SPEED: 6,
    MAX_AIR_SPEED: 8,
    FRICTION: 6,
};

const useStoreImpl = create((set) => ({
    controls,
    playerMoveInfo,
    playerConfig,
    quadTree,
    //   Textures!
    texture: 'grass',
    setTexture: (texture) => set((state) => ({ texture })),
    saveWorld: () =>
        set((state) => {
            setLocalStorage('world', state.cubes);
        }),
    setCubeQuadTree: (cubeQuadTree) => set({ cubeQuadTree }),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
}));

const useStore = (sel) => useStoreImpl(sel, shallow);
Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };
