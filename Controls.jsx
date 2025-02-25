import React, { useState } from 'react';
import { Zap, Plus } from 'lucide-react';
import FunctionVisualizer from './FunctionVisualizer';
import FunctionCard from './FunctionCard';

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: 'darkslategray',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    marginBottom: '24px',
    borderBottom: '1px solid gainsboro',
    paddingBottom: '16px'
  },
  title: {
    fontSize: '24px',
    margin: 0,
    color: 'midnightblue',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  subtitle: {
    fontSize: '14px',
    color: 'gray',
    margin: '8px 0 0 0',
    fontWeight: '400'
  },
  visualizerContainer: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    border: '1px solid gainsboro'
  },
  addFunctionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'aliceblue',
    border: '2px dashed lightsteelblue',
    borderRadius: '12px',
    color: 'royalblue',
    cursor: 'pointer',
    width: '100%',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    marginBottom: '16px'
  }
};

function Controls({ 
  functions,
  onUpdateFunction,
  onUpdateFunctionParameter,
  onUpdateNoiseParameter,
  onAddFunction,
  onRemoveFunction
}) {
  const [activeFunction, setActiveFunction] = useState(0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Zap size={22} />
          Matheria Genesis
        </h2>
        <p style={styles.subtitle}>Générateur de terrain mathématique</p>
      </div>

      <div style={styles.visualizerContainer}>
        <FunctionVisualizer 
          functions={functions.filter(f => f.visible !== false)}
          width={380} 
          height={140}
        />
      </div>

      <button 
        style={styles.addFunctionButton}
        onClick={onAddFunction}
      >
        <Plus size={16} />
        Ajouter une fonction
      </button>

      {functions.map((func, index) => (
        <FunctionCard
          key={index}
          func={func}
          index={index}
          isActive={activeFunction === index}
          onUpdateFunction={onUpdateFunction}
          onUpdateFunctionParameter={onUpdateFunctionParameter}
          onUpdateNoiseParameter={onUpdateNoiseParameter}
          onRemoveFunction={onRemoveFunction}
          onActivate={setActiveFunction}
          isRemovable={functions.length > 1}
        />
      ))}
    </div>
  );
}

export default Controls;