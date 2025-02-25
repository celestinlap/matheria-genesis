import React from 'react';
import { Wifi } from 'lucide-react';
import RangeParam from './RangeParam';

const styles = {
  paramGroup: {
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    userSelect: 'none'
  },
  checkbox: {
    accentColor: '#2563eb',
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  headerLabel: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px'
  },
  headerText: {
    fontWeight: 600, 
    fontSize: '14px'
  },
  paramContainer: {
    paddingLeft: '10px'
  }
};

const NoiseControls = ({ index, parameters, onUpdateNoiseParameter }) => {
  const toggleNoiseEnabled = () => {
    const currentValue = parameters.noiseParams?.enabled !== false;
    onUpdateNoiseParameter(index, 'enabled', !currentValue);
  };
  
  // On vérifie si le bruit est activé
  const isNoiseEnabled = parameters.noiseParams?.enabled !== false;
  
  // L'élément à droite à cocher
  const toggleCheckbox = (
    <label style={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={isNoiseEnabled}
        onChange={toggleNoiseEnabled}
        style={styles.checkbox}
      />
      Activer
    </label>
  );
  
  // On vérifie si noiseParams existe
  if (!parameters.noiseParams) {
    return null;
  }
  
  return (
    <div style={styles.paramGroup}>
      <div style={styles.header}>
        <div style={styles.headerLabel}>
          <Wifi size={14} />
          <span style={styles.headerText}>Paramètres du bruit</span>
        </div>
        {toggleCheckbox}
      </div>
      
      {isNoiseEnabled && (
        <div style={styles.paramContainer}>
          <RangeParam
            label="Force"
            value={parameters.noiseParams.strength || 5}
            min={0}
            max={20}
            step={0.5}
            onChange={(value) => onUpdateNoiseParameter(index, 'strength', value)}
          />
          <RangeParam
            label="Échelle"
            value={parameters.noiseParams.scale || 0.1}
            min={0.01}
            max={1}
            step={0.01}
            onChange={(value) => onUpdateNoiseParameter(index, 'scale', value)}
          />
          <RangeParam
            label="Octaves"
            value={parameters.noiseParams.octaves || 4}
            min={1}
            max={8}
            step={1}
            onChange={(value) => onUpdateNoiseParameter(index, 'octaves', value)}
          />
          <RangeParam
            label="Persistance"
            value={parameters.noiseParams.persistence || 0.5}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={(value) => onUpdateNoiseParameter(index, 'persistence', value)}
          />
        </div>
      )}
    </div>
  );
};

export default NoiseControls;