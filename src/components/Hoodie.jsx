import React, { useState } from "react";
import { useGLTF, useTexture, Decal, PresentationControls } from "@react-three/drei";
import { useControls } from "leva";
import { useSelector } from "react-redux";
import { getImageSelector } from "../redux/slices/imageUploadSlice";

export function Hoodie(props) {
    const { nodes, materials } = useGLTF("/models/another-rug.glb"); // Yeni modelin dosya yolu

    return (
        <PresentationControls
            global
            rotation={[1.1, 3.13, 0]}
            polar={[-0.4, 0.2]}
            azimuth={[-2, 1.75]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 200 }}
        >
            <group scale={[0.1, 0.1, 0.1]} {...props} dispose={null}> {}
               
                <group position={[-0.01, 1.945, 1.065]} rotation={[1.500, 0, 0]} scale={0.075}>
                
                    <PrintableMaterialFront />
                </group>
              
            </group>
        </PresentationControls>
    );
}

const PrintableMaterialFront = () => {
    const { nodes, materials } = useGLTF("/models/another-rug.glb");
    const uploadedImage = useSelector(getImageSelector);
    const { image, height, width } = useSelector(getImageSelector);
    const texture = useTexture(image);

    const firstMesh = Object.values(nodes).find(node => node.isMesh); // İlk uygun mesh'i bul

    // Decal ayarları
    const { YatayPozisyon, DikeyPozisyon, DikeyCevir, YatayCevir, Dondur, boyut } = useControls("Baskı Ayarları", {
        YatayPozisyon: { min: -20, max: 20, value: 0, step: 0.01 },
        DikeyPozisyon: { min: -20, max: 20, value: 0, step: 0.01 },
        DikeyCevir: { min: 0, max: Math.PI , value: 0, step:3.14  },
        YatayCevir: { min: 0, max: Math.PI , value: 3.14, step: 3.14 },
        Dondur: { min: 0, max: Math.PI * 2, value: 0, step: 0.01 },
        boyut: { min: 0.1, max: 100, value: 6, step: 1 },
    });

    return firstMesh ? (
        <mesh geometry={firstMesh.geometry} material={materials[firstMesh.material.name]}>
            <Decal
                position={[YatayPozisyon, DikeyPozisyon, 0]}
                rotation={[DikeyCevir, YatayCevir, Dondur]}
                scale={[(width / 100) * boyut, (height / 100) * boyut, 1]}
            >
                <meshBasicMaterial
                    map={texture}
                    transparent={true}  // Şeffaflığı kapattık
                    opacity={0.8}          // Tam görünürlük
                    depthTest={false}    // Decal'in arkaya kaymasını engeller
                    depthWrite={true}   // Derinlik yazmayı kapatarak netliği artırır
                    alphaTest={0.5}      // Düşük alfa değerlerini filtreler
                />
            </Decal>
        </mesh>
    ) : null;
};


useGLTF.preload("/models/another-rug.glb");
