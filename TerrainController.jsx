import { useState, useEffect } from 'react';
import TerrainModel from '../models/TerrainModel';

function TerrainController() {
  const [terrainModel] = useState(() => new TerrainModel(50));
  const [heightMap, setHeightMap] = useState([]);
  
  // On crée une fonction par défaut avec tout ce qu'il faut
  const createDefaultFunction = (type = 'sine', operation = 'add') => {
    return {
      type,
      parameters: {
        amplitude: 5,
        frequency: 0.1,
        a: 1,
        k: 0,
        base: Math.E,
        scale: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      noiseParams: {
        enabled: true,
        strength: 5,
        scale: 0.1,
        octaves: 4,
        persistence: 0.5
      },
      weight: 1,
      operation,
      visible: true 
    };
  };
  
  // État initial avec une seule fonction
  const [functions, setFunctions] = useState([createDefaultFunction()]);

  // On met à jour la heightmap quand les fonctions changent (C'est react qui détecte)
  useEffect(() => {
    const visibleFunctions = functions.filter(func => func.visible !== false);
    const newHeightMap = terrainModel.combineFunctions(visibleFunctions);
    setHeightMap([...newHeightMap]);
  }, [functions]);

  // On met à jour une fonction
  const updateFunction = (index, updates) => {
    const newFunctions = [...functions];
    newFunctions[index] = { ...newFunctions[index], ...updates };
    setFunctions(newFunctions);
  };

  // On met à jour un paramètre spécifique
  const updateFunctionParameter = (index, paramName, value) => {
    const newFunctions = [...functions];
    newFunctions[index].parameters = {
      ...newFunctions[index].parameters,
      [paramName]: value
    };
    setFunctions(newFunctions);
  };

  // On met à jour un paramètre de bruit
  const updateNoiseParameter = (index, paramName, value) => {
    const newFunctions = [...functions];
    newFunctions[index].noiseParams = {
      ...newFunctions[index].noiseParams,
      [paramName]: value
    };
    setFunctions(newFunctions);
  };

  // On ajoute une nouvelle fonction
  const addFunction = () => {
    // On utilise toujours l'opération "add" par défaut (et c'est toujours une sinusoidale par défaut)
    setFunctions([...functions, createDefaultFunction('sine', 'add')]);
  };

  // On supprime une fonction
  const removeFunction = (index) => {
    // On empêche la suppression s'il y a juste une fonction
    if (functions.length <= 1) return; 
    
    const newFunctions = [...functions];
    newFunctions.splice(index, 1);
    setFunctions(newFunctions);
  };

  return {
    heightMap,
    functions,
    updateFunction,
    updateFunctionParameter,
    updateNoiseParameter,
    addFunction,
    removeFunction
  };
}

export default TerrainController;