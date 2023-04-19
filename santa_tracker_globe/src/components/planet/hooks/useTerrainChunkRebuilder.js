import { useState, useEffect, useRef } from 'react';
import { TerrainChunk } from './TerrainChunk';

export function useTerrainChunkRebuilder(params) {
    const [pool, setPool] = useState({});
    const [queued, setQueued] = useState([]);
    const [old, setOld] = useState([]);
    const [newChunks, setNewChunks] = useState([]);
    const active = useRef(null);

    useEffect(() => {
        const update = () => {
            if (active.current) {
                const result = active.current.next();
                if (result.done) {
                    active.current = null;
                }
            } else {
                const chunk = queued.pop();
                if (chunk) {
                    active.current = chunk._Rebuild();
                    setNewChunks((prevNewChunks) => [...prevNewChunks, chunk]);
                }
            }

            if (!active.current && queued.length === 0) {
                recycleChunks(old);
                newChunks.forEach((chunk) => chunk.Show());
                reset();
            }

            requestAnimationFrame(update);
        };

        update();

        return () => {
            cancelAnimationFrame(update);
        };
    }, [queued, old, newChunks]);

    const allocateChunk = (params) => {
        const width = params.width;

        if (!(width in pool)) {
            setPool((prevPool) => ({ ...prevPool, [width]: [] }));
        }

        let chunk = null;
        if (pool[width].length > 0) {
            chunk = pool[width].pop();
            chunk._params = params;
        } else {
            chunk = new TerrainChunk(params);
        }

        chunk.Hide();
        setQueued((prevQueued) => [...prevQueued, chunk]);

        return chunk;
    };

    const recycleChunks = (chunks) => {
        for (let chunkObj of chunks) {
            const chunk = chunkObj.chunk;
            const width = chunk._params.width;

            if (!(width in pool)) {
                setPool((prevPool) => ({ ...prevPool, [width]: [] }));
            }

            chunk.Destroy();
        }
    };

    const reset = () => {
        active.current = null;
        setQueued([]);
        setOld([]);
        setNewChunks([]);
    };

    const rebuild = (chunks) => {
        if (active.current || queued.length > 0) {
            return;
        }
        for (let key in chunks) {
            setQueued((prevQueued) => [...prevQueued, chunks[key].chunk]);
        }
    };

    return {
        allocateChunk,
        rebuild,
        busy: active.current || queued.length > 0,
    };
}
