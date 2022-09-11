import { Vector3 } from 'three';
import create from 'zustand';
import shallow from 'zustand/shallow';


const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value));


export const worldConstants = {
    MIN_CELL_SIZE: 500,
    FIXED_GRID_SIZE: 10,
    MIN_CELL_RESOLUTION: 64,
};


const useStoreImpl = create((set) => ({
    worldConstants,
    cameraPosition: new Vector3(),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    planes: getLocalStorage('world') || {
        '0/0' : { position: [0, 0, 0], size:[500,500], resolution: [64, 64]},
    },


    addPlane: (newChunkKey, x,y,resolution, size) => set( (state) => ({
        planes: {...state.planes, [newChunkKey] : { position: [x, y, 0], size:size, resolution: resolution}}
    })),

    removePlane: (x, y, z) => set((state) => state.planes.filter( (plane) => plane.x !== x || plane.y !== y || plane.z !== z)),
    saveWorld: () =>
        set((state) => {
            setLocalStorage('world', state);
        }),
}));

const useStore = (sel) => useStoreImpl(sel, shallow);
Object.assign(useStore, useStoreImpl);

const { getState, setState } = useStoreImpl;

export { getState, setState, useStore };