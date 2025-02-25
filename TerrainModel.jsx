import NoiseGenerator from '../utils/NoiseGenerator';
import { calculateHeight, applyOperation } from '../utils/MathFunctions';

class TerrainModel {
  
  constructor(gridSize = 50) {
    this.gridSize = gridSize;
    this.heightMap = [];
    this.noiseGen = new NoiseGenerator();
    this.initializeHeightMap();
  }

  // On initialise la heightmap
  initializeHeightMap() {
    this.heightMap = Array(this.gridSize).fill().map(() => 
      Array(this.gridSize).fill(0)
    );
  }

  // On combine la heightmap avec le noise (si il est activé)
  combineWithNoise(baseHeight, x, z, noiseParams = {}) {
    if (!noiseParams || noiseParams.enabled === false) {
      return baseHeight;
    }

    const {
      octaves = 4,
      persistence = 0.5,
      scale = 0.1,
      strength = 1
    } = noiseParams;

    const normalizedX = x / this.gridSize;
    const normalizedZ = z / this.gridSize;
    
    const noise = this.noiseGen.octaves(
      normalizedX,
      normalizedZ,
      octaves,
      persistence,
      scale
    );

    return baseHeight + (noise * strength);
  }

  // On combine des fonctions
  combineFunctions(functions) {
    
    // On réinitialise la heightmap
    this.initializeHeightMap();
    
    if (!functions.length) return this.heightMap;
    
    // On crée une heightmap temporaire pour chaque fonction
    const tempMaps = functions.map(func => {
      const tempMap = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
      
      for (let x = 0; x < this.gridSize; x++) {
        for (let z = 0; z < this.gridSize; z++) {
          const xVal = (x - this.gridSize / 2) / (this.gridSize / 2);
          const zVal = (z - this.gridSize / 2) / (this.gridSize / 2);
          
          const baseHeight = calculateHeight(func.type, xVal, zVal, func.parameters);
          tempMap[x][z] = this.combineWithNoise(baseHeight, x, z, func.noiseParams);
        }
      }
      
      return {
        map: tempMap,
        weight: func.weight || 1,
        operation: func.operation || 'add'
      };
    });

    // On initialise avec la première fonction
    if (tempMaps.length > 0) {
      const firstMap = tempMaps[0];
      for (let x = 0; x < this.gridSize; x++) {
        for (let z = 0; z < this.gridSize; z++) {
          this.heightMap[x][z] = firstMap.map[x][z] * firstMap.weight;
        }
      }

      // On applique les autres fonctions avec les bonnes opérations
      for (let i = 1; i < tempMaps.length; i++) {
        const { map, weight, operation } = tempMaps[i];
        
        for (let x = 0; x < this.gridSize; x++) {
          for (let z = 0; z < this.gridSize; z++) {
            const value = map[x][z] * weight;
            
            // Utiliser la fonction partagée pour appliquer l'opération
            this.heightMap[x][z] = applyOperation(
              this.heightMap[x][z], 
              value, 
              operation
            );
          }
        }
      }
      
      this.normalizeHeightMap(-50, 50);
    }

    return this.heightMap;
  }

  // On normalise la heightmap
  normalizeHeightMap(minHeight = -50, maxHeight = 50) {
    let currentMin = Infinity;
    let currentMax = -Infinity;

    // On trouve les valeurs min et max actuelles
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        currentMin = Math.min(currentMin, this.heightMap[x][z]);
        currentMax = Math.max(currentMax, this.heightMap[x][z]);
      }
    }

    // On évite la division par zéro si min = max
    if (currentMin === currentMax) {
      for (let x = 0; x < this.gridSize; x++) {
        for (let z = 0; z < this.gridSize; z++) {
          this.heightMap[x][z] = (minHeight + maxHeight) / 2;
        }
      }
      return this.heightMap;
    }

    // On normalise les valeurs
    const scale = (maxHeight - minHeight) / (currentMax - currentMin);
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        this.heightMap[x][z] = minHeight + (this.heightMap[x][z] - currentMin) * scale;
      }
    }

    return this.heightMap;
  }
}

export default TerrainModel;