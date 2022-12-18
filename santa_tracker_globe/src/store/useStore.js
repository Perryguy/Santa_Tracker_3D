import * as THREE from 'three';
import create from 'zustand';
import shallow from 'zustand/shallow';


const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value));


export const worldConstants = {
    MIN_CELL_SIZE: 50,
    FIXED_GRID_SIZE: 10,
    MIN_CELL_RESOLUTION: 32,
    MIN_NODE_SIZE: 1
};


const useStoreImpl = create((set) => ({
    worldConstants,
    cameraPosition: new THREE.Vector3(),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    planes: getLocalStorage('plane'),
    addPlane: (newChunkKey, x,y,resolution, size) => set( (state) => ({
        planes: {...state.planes, [newChunkKey] : { position: [x, y, 0], size:size, resolution: resolution}}
    })),
    removePlane: (x, y, z) => set((state) => state.planes.filter( (plane) => plane.x !== x || plane.y !== y || plane.z !== z)),
    quadTreeRoot: getLocalStorage('quad'),
    setQuadTreeRoot: (bounds, children, center, size) => set((state) => ({
        quadTreeRoot: { bounds: bounds, children: children, center: center, size: size  }
    })),
    saveWorld: () =>
        set((state) => {
            setLocalStorage('world', state);
        }),
}));

const useStore = (sel) => useStoreImpl(sel, shallow);
Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };