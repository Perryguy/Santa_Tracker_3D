/* eslint-disable react/no-unknown-property */
import { useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, SpotLight,ContactShadows, softShadows } from '@react-three/drei';
import { TextureLoader } from 'three';
import React from 'react';

import EarthNormalMap from '../../assets/textures/nomalmap.png';
import EarthDayMap from '../../assets/textures/daymap.jpg';
import EarthSpecularMap from '../../assets/textures/specularmap.jpg';
import Test from '../../assets/textures/gebco_bathy.5400x2700_8bit.jpg';

function Earth(props){
    const [ normalMap, dayMap, specularMap, second ] = useLoader(TextureLoader, [Test, EarthDayMap, EarthSpecularMap, EarthNormalMap]);
    const { gl } = useThree();
    gl.shadowMap.enabled = true;
  
    // softShadows();
    return(
        <>
            <ambientLight intensity={0.4}/>
            <directionalLight
                castShadow
                position={[2.5, 8, 5]}
                intensity={1.5}
                shadow-mapSize-width={7680}
                shadow-mapSize-height={4320}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* <pointLight castShadow position={[5,5,10]}  intensity={0.6}/> */}
            <mesh receiveShadow castShadow >
                <sphereGeometry args={[40,5760,2880]}/>
                <meshPhongMaterial color={specularMap} />
                <meshStandardMaterial displacementMap={normalMap} map={dayMap} color={'grey'}  displacementScale={10}/>
                <OrbitControls enableZoom={true} enableRotate={true} rotateSpeed={0.4} panSpeed={0.5} zoomSpeed={0.6}/>
            </mesh>
        </>
    );
}
export default Earth;