import * as THREE from 'three';
import QuadTree from './quadTreeclass';

function createQuadtree(params) {
    const sides = [];


    const r = params.radius;
    let m;

    const transforms = [];

    // +Y
    m = new THREE.Matrix4();
    m.makeRotationX(-Math.PI / 2);
    m.premultiply(new THREE.Matrix4().makeTranslation(0, r, 0));
    transforms.push(m);

    // -Y
    m = new THREE.Matrix4();
    m.makeRotationX(Math.PI / 2);
    m.premultiply(new THREE.Matrix4().makeTranslation(0, -r, 0));
    transforms.push(m);

    // +X
    m = new THREE.Matrix4();
    m.makeRotationY(Math.PI / 2);
    m.premultiply(new THREE.Matrix4().makeTranslation(r, 0, 0));
    transforms.push(m);

    // -X
    m = new THREE.Matrix4();
    m.makeRotationY(-Math.PI / 2);
    m.premultiply(new THREE.Matrix4().makeTranslation(-r, 0, 0));
    transforms.push(m);

    // +Z
    m = new THREE.Matrix4();
    m.premultiply(new THREE.Matrix4().makeTranslation(0, 0, r));
    transforms.push(m);

    // -Z
    m = new THREE.Matrix4();
    m.makeRotationY(Math.PI);
    m.premultiply(new THREE.Matrix4().makeTranslation(0, 0, -r));
    transforms.push(m);

    for (let t of transforms) {
        sides.push({
            transform: t.clone(),
            worldToLocal: t.clone().invert(t),
            quadtree: new QuadTree({
                size: r,
                min_node_size: params.min_node_size,
                localToWorld: t,
            }),
        });
    }

    const GetChildren = () => {
        const children = [];

        for (let s of sides) {
            const side = {
                transform: s.transform,
                children: s.quadtree.GetChildren(),
            };
            children.push(side);
        }
        return children;
    };

    const Insert = (pos) => {
        for (let s of sides) {
            s.quadtree.Insert(pos);
        }
    };

    return {
        params,
        sides,
        Insert,
        GetChildren,
    };
}

export default createQuadtree;
