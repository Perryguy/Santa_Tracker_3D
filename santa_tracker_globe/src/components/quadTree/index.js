import React from 'react';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export function GetChildren() {
    const [ quadTreeRoot] = useStore((state)=> [
        state.quadTreeRoot
    ]);
    const children = [];
    InternalGetChildren(quadTreeRoot, children);
    return children;
}

export function Insert(pos) {
    const [ quadTreeRoot] = useStore((state)=> [
        state.quadTreeRoot
    ]);
    InternalInsert(quadTreeRoot, new THREE.Vector2(pos.x, pos.z));
}


function InternalGetChildren(node, target) {
    if (node.children.length === 0) {
        target.push(node);
        return;
    }
}
    
function InternalInsert(child, pos) {
    const [ worldConstants] = useStore((state)=> [
        state.worldConstants
    ]);

    const distToChild = InternalDistanceToChild(child, pos);
      
    if (distToChild < child.size.x && child.size.x > worldConstants.MIN_NODE_SIZE) {
        child.children = InternalCreateChildren(child);
      
        for (let c of child.children) {
            InternalInsert(c, pos);
        }
    }
}

function InternalDistanceToChild(child, pos) {
    return child.center.distanceTo(pos);
}


function InternalCreateChildren(child){
    
    const midpoint = child.bounds.getCenter(new THREE.Vector2());

    // Bottom left
    const b1 = new THREE.Box2(child.bounds.min, midpoint);

    // Bottom right
    const b2 = new THREE.Box2(
        new THREE.Vector2(midpoint.x, child.bounds.min.y),
        new THREE.Vector2(child.bounds.max.x, midpoint.y));

    // Top left
    const b3 = new THREE.Box2(
        new THREE.Vector2(child.bounds.min.x, midpoint.y),
        new THREE.Vector2(midpoint.x, child.bounds.max.y));

    // Top right
    const b4 = new THREE.Box2(midpoint, child.bounds.max);

    const children = [b1, b2, b3, b4].map(
        b => {
            return {
                bounds: b,
                children: [],
                center: b.getCenter(new THREE.Vector2()),
                size: b.getSize(new THREE.Vector2())
            };
        });
    return children;
}
    
