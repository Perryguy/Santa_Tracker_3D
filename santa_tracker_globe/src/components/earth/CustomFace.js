/* eslint-disable react/no-unknown-property */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGenerateCubeSide } from '../../hooks/useGenerateCubeSide';
import { useNormalizeVerticesToSphere } from '../../hooks/useNormalizeVerticesToSphere';

const CustomFace = ({ normal, material, radius, resolution }) => {
    const geometry = useGenerateCubeSide(normal, resolution);
    const sphereGeometry = useNormalizeVerticesToSphere(geometry, radius);
    if (!geometry || !sphereGeometry) {
        return null;
    }

    return <mesh geometry={sphereGeometry} material={material} />;
};

export default CustomFace;
