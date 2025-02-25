import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

// On peut mapper des valeurs
const mapValue = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

// On generate une couleur basée sur la hauteur (altitude du terrain)
const getTerrainColor = (height) => {
  if (height < -20) return new THREE.Color('steelblue'); 
  if (height < -10) return new THREE.Color('dodgerblue');
  if (height < 0) return new THREE.Color('lightskyblue'); 
  if (height < 5) return new THREE.Color('sandybrown');
  if (height < 15) return new THREE.Color('forestgreen');
  if (height < 25) return new THREE.Color('darkgreen'); 
  if (height < 35) return new THREE.Color('saddlebrown');
  if (height < 40) return new THREE.Color('gray'); 
  return new THREE.Color('white');          
};

function Terrain({ heightMap, renderSettings = {} }) {
  const meshRef = useRef();
  const { camera } = useThree();

  // Réglages d'affichage par défaut
  const settings = {
    wireframe: renderSettings.wireframe || false,
    colorMode: renderSettings.colorMode || 'height',
    smoothShading: renderSettings.smoothShading !== false, // true par défaut
    waterLevel: renderSettings.waterLevel || -5,
    ...renderSettings
  };

  const generateGeometry = () => {
    if (!heightMap?.length) return null;
    
    const size = heightMap.length;
    const vertices = [];
    const colors = [];
    const indices = [];
    const uvs = [];

    // On trouve les valeurs min et max pour la normalisation des couleurs
    let minHeight = Infinity;
    let maxHeight = -Infinity;

    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        minHeight = Math.min(minHeight, heightMap[x][z]);
        maxHeight = Math.max(maxHeight, heightMap[x][z]);
      }
    }

    // On génère les sommets
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        const height = heightMap[x][z];
        
        vertices.push(
          x - size/2,           // x
          height,               // y (hauteur)
          z - size/2            // z
        );
        
        // On ajuste les couleurs
        const color = getTerrainColor(height);
        colors.push(color.r, color.g, color.b);
        
        // On ajoute les coordonnées UV pour la texture
        uvs.push(x / (size - 1), z / (size - 1));
      }
    }

    // On génère les triangles
    for (let z = 0; z < size - 1; z++) {
      for (let x = 0; x < size - 1; x++) {
        const tl = z * size + x;
        const tr = tl + 1;
        const bl = (z + 1) * size + x;
        const br = bl + 1;

        indices.push(tl, bl, tr);
        indices.push(tr, bl, br);
      }
    }

    return { vertices, colors, indices, uvs };
  };

  // On met à jour la géométrie quand la heightMap change (avec le hook react)
  useEffect(() => {
    if (meshRef.current && heightMap?.length) {
      const geometry = generateGeometry();
      if (geometry) {
        const { vertices, colors, indices, uvs } = geometry;
        
        meshRef.current.geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        
        meshRef.current.geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute(colors, 3)
        );
        
        meshRef.current.geometry.setAttribute(
          'uv',
          new THREE.Float32BufferAttribute(uvs, 2)
        );
        
        meshRef.current.geometry.setIndex(indices);
        meshRef.current.geometry.computeVertexNormals();
        meshRef.current.geometry.computeBoundingSphere();
        
        // On met à jour le matériau (pour la couleur)
        if (meshRef.current.material) {
          meshRef.current.material.wireframe = settings.wireframe;
          meshRef.current.material.vertexColors = settings.colorMode === 'height';
          meshRef.current.material.flatShading = !settings.smoothShading;
          meshRef.current.material.needsUpdate = true;
        }
      }
    }
  }, [heightMap, settings.wireframe, settings.colorMode, settings.smoothShading]);

  // On ajoute une rotation lente
  useFrame(() => {
    if (meshRef.current && settings.rotate) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  const geometry = generateGeometry();
  if (!geometry) return null;

  return (
    <group>
      <mesh ref={meshRef} receiveShadow castShadow>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.vertices.length / 3}
            array={new Float32Array(geometry.vertices)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometry.colors.length / 3}
            array={new Float32Array(geometry.colors)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-uv"
            count={geometry.uvs.length / 2}
            array={new Float32Array(geometry.uvs)}
            itemSize={2}
          />
          <bufferAttribute
            attach="index"
            array={new Uint16Array(geometry.indices)}
            count={geometry.indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <meshStandardMaterial 
          color={settings.colorMode === 'height' ? 'white' : '#3f7f7f'}
          wireframe={settings.wireframe}
          vertexColors={settings.colorMode === 'height'} 
          flatShading={!settings.smoothShading}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* On ajoute un plan d'eau s'il est activé */}
      {settings.showWater && (
        <mesh position={[0, settings.waterLevel, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[heightMap.length, heightMap.length, 1, 1]} />
          <meshStandardMaterial 
            color="#0080ff" 
            transparent={true} 
            opacity={0.7}
            roughness={0.0}
            metalness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

// Barre flottante de contrôles pour la visualisation
const ViewControls = ({ settings, onSettingsChange }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      padding: '8px 16px',
      display: 'flex',
      gap: '16px',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      {/* On active la vue wireframe */}
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: settings.wireframe ? '#3b82f6' : 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px'
        }}
        onClick={() => onSettingsChange({ ...settings, wireframe: !settings.wireframe })}
      >
        <span style={{ fontSize: '18px' }}>⊞</span>
        Wireframe
      </button>

      {/* On active le mode couleur */}
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: settings.colorMode === 'height' ? '#3b82f6' : 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px'
        }}
        onClick={() => onSettingsChange({ 
          ...settings, 
          colorMode: settings.colorMode === 'height' ? 'solid' : 'height' 
        })}
      >
        <span style={{ fontSize: '18px' }}>🎨</span>
        Couleur
      </button>

      {/* On active le smooth shading */}
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: settings.smoothShading ? '#3b82f6' : 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px'
        }}
        onClick={() => onSettingsChange({ ...settings, smoothShading: !settings.smoothShading })}
      >
        <span style={{ fontSize: '18px' }}>◢</span>
        Lissage
      </button>

      {/* On active l'eau */}
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: settings.showWater ? '#3b82f6' : 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px'
        }}
        onClick={() => onSettingsChange({ ...settings, showWater: !settings.showWater })}
      >
        <span style={{ fontSize: '18px' }}>≈</span>
        Eau
      </button>

      {/* On active la rotation */}
      <button 
        style={{
          background: 'transparent',
          border: 'none',
          color: settings.rotate ? '#3b82f6' : 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px'
        }}
        onClick={() => onSettingsChange({ ...settings, rotate: !settings.rotate })}
      >
        <span style={{ fontSize: '18px' }}>↻</span>
        Rotation
      </button>
    </div>
  );
};

function TerrainView({ heightMap }) {
  const [renderSettings, setRenderSettings] = useState({
    wireframe: false,
    colorMode: 'height',
    smoothShading: true,
    showWater: true,
    waterLevel: -5,
    rotate: false
  });

  return (
    <div style={{ 
      position: 'relative',
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#111'
    }}>
      <Canvas
        shadows
        camera={{ position: [75, 75, 75], fov: 45 }}
        style={{ background: 'linear-gradient(to bottom, #1e3c72, #2a5298)' }}
      >
        <Sky 
          distance={450000} 
          sunPosition={[0, 1, 0]} 
          inclination={0.5} 
          azimuth={0.25} 
        />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[50, 100, 50]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <pointLight position={[-100, 100, -100]} intensity={0.5} color="#ffccaa" />
        <fog attach="fog" args={['#214365', 50, 400]} />
        
        <Terrain heightMap={heightMap} renderSettings={renderSettings} />
        
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={10} 
          maxDistance={200}
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
        />
      </Canvas>
      
      <ViewControls settings={renderSettings} onSettingsChange={setRenderSettings} />
    </div>
  );
}

export default TerrainView;