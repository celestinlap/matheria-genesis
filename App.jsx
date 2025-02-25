import React, { useState } from 'react';
import TerrainView from './views/TerrainView';
import Controls from './components/UI/Controls';
import TerrainController from './controllers/TerrainController';
import { ChevronRight, Settings } from 'lucide-react';

const styles = {
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
  terrainContainer: {
    flex: 1,
    position: 'relative',
    height: '100%',
    minWidth: 0,
    transition: 'margin-right 0.3s ease',
  },
  toggleButton: (controlsOpen) => ({
    position: 'absolute',
    top: '20px',
    right: controlsOpen ? '420px' : '20px',
    zIndex: 100,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transition: 'right 0.3s ease',
  }),
  controlsPanel: (controlsOpen) => ({
    width: '400px',
    height: '100%',
    overflowY: 'auto',
    borderLeft: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    position: 'absolute',
    right: controlsOpen ? '0' : '-400px',
    top: 0,
    bottom: 0,
    transition: 'right 0.3s ease',
    boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
    zIndex: 50,
  }),
};

function App() {
  // On récupère les données du TerrainController 
  let heightMap, functions, updateFunction, updateFunctionParameter, updateNoiseParameter, addFunction, removeFunction;

  try {
    ({ heightMap, functions, updateFunction, updateFunctionParameter, updateNoiseParameter, addFunction, removeFunction } = TerrainController());
  } catch (error) {
    console.error("Erreur lors de l'initialisation de TerrainController :", error);
    heightMap = [];
    functions = [];
  }

  // État du panneau de contrôle
  const [controlsOpen, setControlsOpen] = useState(true);

  return (
    <div style={styles.appContainer}>
      {/* Zone principale affichant le terrain */}
      <div style={styles.terrainContainer}>
        {heightMap?.length ? (
          <TerrainView heightMap={heightMap} />
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement du terrain...</p>
        )}
      </div>

      {/* Bouton pour ouvrir et fermer le panneau de contrôle */}
      <button
        onClick={() => setControlsOpen(prev => !prev)}
        style={styles.toggleButton(controlsOpen)}
        title={controlsOpen ? "Réduire les contrôles" : "Afficher les contrôles"}
      >
        {controlsOpen ? <ChevronRight size={20} /> : <Settings size={20} />}
      </button>

      {/* Panneau de contrôle des paramètres du terrain */}
      <div style={styles.controlsPanel(controlsOpen)}>
        {functions?.length ? (
          <Controls
            functions={functions}
            onUpdateFunction={updateFunction}
            onUpdateFunctionParameter={updateFunctionParameter}
            onUpdateNoiseParameter={updateNoiseParameter}
            onAddFunction={addFunction}
            onRemoveFunction={removeFunction}
          />
        ) : (
          <p style={{ padding: '20px', textAlign: 'center' }}>Aucune fonction disponible.</p>
        )}
      </div>
    </div>
  );
}

export default App;
