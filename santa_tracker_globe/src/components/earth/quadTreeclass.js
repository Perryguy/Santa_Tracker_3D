import * as THREE from 'three';

class QuadTree {
    constructor(params) {
        const s = params.size;
        const b = new THREE.Box3(
            new THREE.Vector3(-s, -s, 0),
            new THREE.Vector3(s, s, 0),
        );
        this._root = {
            bounds: b,
            children: [],
            center: b.getCenter(new THREE.Vector3()),
            sphereCenter: b.getCenter(new THREE.Vector3()),
            size: b.getSize(new THREE.Vector3()),
            root: true,
        };

        this._params = params;
        this._root.sphereCenter = this._root.center.clone();
        this._root.sphereCenter.applyMatrix4(this._params.localToWorld);
        this._root.sphereCenter.normalize();
        this._root.sphereCenter.multiplyScalar(this._params.size);
    }

    GetChildren() {
        const children = [];
        this._GetChildren(this._root, children);
        return children;
    }

    _GetChildren(node, target) {
        if (node.children.length === 0) {
            target.push(node);
            return;
        }

        for (let c of node.children) {
            this._GetChildren(c, target);
        }
    }

    Insert(pos) {
        this._Insert(this._root, pos);
    }

    _Insert(child, pos) {
        const distToChild = this._DistanceToChild(child, pos);

        if (
            distToChild < child.size.x * 1.25 &&
            child.size.x > this._params.min_node_size
        ) {
            child.children = this._CreateChildren(child);

            for (let c of child.children) {
                this._Insert(c, pos);
            }
        }
    }

    _DistanceToChild(child, pos) {
        return child.sphereCenter.distanceTo(pos);
    }

    _CreateChildren(child) {
        const midpoint = child.bounds.getCenter(new THREE.Vector3());

        // Bottom left
        const b1 = new THREE.Box3(child.bounds.min, midpoint);

        // Bottom right
        const b2 = new THREE.Box3(
            new THREE.Vector3(midpoint.x, child.bounds.min.y, 0),
            new THREE.Vector3(child.bounds.max.x, midpoint.y, 0),
        );

        // Top left
        const b3 = new THREE.Box3(
            new THREE.Vector3(child.bounds.min.x, midpoint.y, 0),
            new THREE.Vector3(midpoint.x, child.bounds.max.y, 0),
        );

        // Top right
        const b4 = new THREE.Box3(midpoint, child.bounds.max);

        const children = [b1, b2, b3, b4].map((b) => {
            return {
                bounds: b,
                children: [],
                center: b.getCenter(new THREE.Vector3()),
                size: b.getSize(new THREE.Vector3()),
            };
        });

        for (let c of children) {
            c.sphereCenter = c.center.clone();
            c.sphereCenter.applyMatrix4(this._params.localToWorld);
            c.sphereCenter.normalize();
            c.sphereCenter.multiplyScalar(this._params.size);
        }

        return children;
    }
}

export default QuadTree;
