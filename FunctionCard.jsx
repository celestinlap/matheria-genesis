import React from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import RangeParam from './RangeParam';
import NoiseControls from './NoiseControls';
import OperationBadge from './OperationBadge';
import { getFunctionName } from '../../utils/MathFunctions';

const styles = {
  card: {
    backgroundColor: 'ghostwhite',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid gainsboro',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
  },
  activeCard: {
    borderColor: 'royalblue',
    backgroundColor: 'aliceblue'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  functionType: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    color: 'dimgray',
    fontSize: '15px'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  iconButton: {
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'slategray',
    transition: 'all 0.1s ease',
  },
  deleteButton: {
    color: 'crimson',
  },
  paramGroup: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid gainsboro',
    backgroundColor: 'white',
    fontSize: '14px',
    color: 'dimgray',
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s ease',
  },
  paramControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '60%'
  },
  paramRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  paramLabel: {
    fontSize: '14px',
    color: 'slategray',
    fontWeight: '500',
    width: '40%'
  }
};

const FunctionCard = ({ 
  func, 
  index, 
  isActive, 
  onUpdateFunction, 
  onUpdateFunctionParameter, 
  onUpdateNoiseParameter, 
  onRemoveFunction,
  onActivate,
  isRemovable
}) => {
  // Rendu des paramètres selon le type de fonction
  const renderFunctionParams = () => {
    const params = func.parameters;
    
    switch(func.type) {
      case 'sine':
        return (
          <>
            <RangeParam
              label="Amplitude"
              value={params.amplitude}
              min={0}
              max={50}
              step={0.5}
              onChange={(value) => onUpdateFunctionParameter(index, 'amplitude', value)}
            />
            <RangeParam
              label="Fréquence"
              value={params.frequency}
              min={0.01}
              max={3}
              step={0.05}
              onChange={(value) => onUpdateFunctionParameter(index, 'frequency', value)}
            />
          </>
        );

      case 'quadratic':
        return (
          <>
            <RangeParam
              label="Courbure (a)"
              value={params.a}
              min={-10}
              max={10}
              step={0.5}
              onChange={(value) => onUpdateFunctionParameter(index, 'a', value)}
            />
            <RangeParam
              label="Décalage (k)"
              value={params.k}
              min={-20}
              max={20}
              step={1}
              onChange={(value) => onUpdateFunctionParameter(index, 'k', value)}
            />
          </>
        );

      case 'exponential':
        return (
          <>
            <RangeParam
              label="Base"
              value={params.base}
              min={1.1}
              max={10}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'base', value)}
            />
            <RangeParam
              label="Échelle"
              value={params.scale}
              min={0.1}
              max={30}
              step={0.5}
              onChange={(value) => onUpdateFunctionParameter(index, 'scale', value)}
            />
          </>
        );

      case 'tangent':
        return (
          <>
            <RangeParam
              label="Amplitude"
              value={params.amplitude}
              min={0}
              max={30}
              step={0.5}
              onChange={(value) => onUpdateFunctionParameter(index, 'amplitude', value)}
            />
            <RangeParam
              label="Fréquence"
              value={params.frequency}
              min={0.01}
              max={2}
              step={0.05}
              onChange={(value) => onUpdateFunctionParameter(index, 'frequency', value)}
            />
          </>
        );

      case 'cubic':
        return (
          <>
            <RangeParam
              label="Coefficient a (x³)"
              value={params.a}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'a', value)}
            />
            <RangeParam
              label="Coefficient b (x²)"
              value={params.b}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'b', value)}
            />
            <RangeParam
              label="Coefficient c (x)"
              value={params.c}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'c', value)}
            />
            <RangeParam
              label="Constante d"
              value={params.d}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'd', value)}
            />
          </>
        );

      case 'hyperbolic':
        return (
          <>
            <RangeParam
              label="Amplitude"
              value={params.amplitude}
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'amplitude', value)}
            />
            <RangeParam
              label="Échelle"
              value={params.scale}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'scale', value)}
            />
          </>
        );

      case 'logarithmic':
        return (
          <>
            <RangeParam
              label="Base"
              value={params.base}
              min={2}
              max={10}
              step={1}
              onChange={(value) => onUpdateFunctionParameter(index, 'base', value)}
            />
            <RangeParam
              label="Échelle"
              value={params.scale}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'scale', value)}
            />
          </>
        );

      case 'rational':
        return (
          <>
            <RangeParam
              label="Paramètre a"
              value={params.a}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'a', value)}
            />
            <RangeParam
              label="Coefficient b"
              value={params.b}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(value) => onUpdateFunctionParameter(index, 'b', value)}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      style={{...styles.card, ...(isActive ? styles.activeCard : {})}}
      onClick={() => onActivate(index)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.functionType}>
          <span>{index > 0 && <OperationBadge operation={func.operation} />}</span>
          <span>{getFunctionName(func.type)}</span>
        </div>
        <div style={styles.cardActions}>
          <button
            style={styles.iconButton}
            onClick={(e) => {
              e.stopPropagation();
              const eyeIconClick = !func.visible;
              onUpdateFunction(index, { visible: eyeIconClick });
            }}
            title={func.visible !== false ? "Masquer cette fonction" : "Afficher cette fonction"}
          >
            {func.visible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          {isRemovable && (
            <button
              style={{...styles.iconButton, ...styles.deleteButton}}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFunction(index);
              }}
              title="Supprimer cette fonction"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div onClick={(e) => e.stopPropagation()}>
          <div style={styles.paramGroup}>
            <div style={styles.paramRow}>
              <span style={styles.paramLabel}>Type de fonction</span>
              <div style={styles.paramControl}>
                <select
                  value={func.type}
                  onChange={(e) => onUpdateFunction(index, { type: e.target.value })}
                  style={styles.select}
                >
                  <option value="sine">Sinusoïdale</option>
                  <option value="quadratic">Quadratique</option>
                  <option value="exponential">Exponentielle</option>
                  <option value="tangent">Tangente</option>
                  <option value="cubic">Cubique</option>
                  <option value="hyperbolic">Hyperbolique</option>
                  <option value="logarithmic">Logarithmique</option>
                  <option value="rational">Rationnelle</option>
                </select>
              </div>
            </div>

            {index > 0 && (
              <div style={styles.paramRow}>
                <span style={styles.paramLabel}>Opération</span>
                <div style={styles.paramControl}>
                  <select
                    value={func.operation}
                    onChange={(e) => onUpdateFunction(index, { operation: e.target.value })}
                    style={styles.select}
                  >
                    <option value="add">Addition (+)</option>
                    <option value="multiply">Multiplication (×)</option>
                    <option value="max">Maximum</option>
                    <option value="min">Minimum</option>
                  </select>
                </div>
              </div>
            )}

            <RangeParam
              label="Poids"
              value={func.weight}
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => onUpdateFunction(index, { weight: value })}
            />
          </div>

          <div style={styles.paramGroup}>
            {renderFunctionParams()}
          </div>

          <NoiseControls
            index={index}
            parameters={func}
            onUpdateNoiseParameter={onUpdateNoiseParameter}
          />
        </div>
      )}
    </div>
  );
};

export default FunctionCard;