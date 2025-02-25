import React from 'react';

const styles = {
  paramRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  paramLabel: {
    fontSize: '14px',
    color: '#4b5563',
    fontWeight: '500',
    width: '40%'
  },
  paramControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '60%'
  },
  rangeContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  rangeInput: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#e5e7eb',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none'
  },
  valueDisplay: {
    width: '50px',
    textAlign: 'center',
    padding: '4px 8px',
    backgroundColor: '#eff6ff',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#2563eb',
    fontWeight: '600',
    userSelect: 'none'
  }
};

const RangeParam = ({ label, value, min, max, step, onChange }) => (
  <div style={styles.paramRow}>
    <span style={styles.paramLabel}>{label}</span>
    <div style={styles.paramControl}>
      <div style={styles.rangeContainer}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={styles.rangeInput}
        />
      </div>
      <span style={styles.valueDisplay}>
        {typeof value === 'number' ? value.toFixed(1) : '0.0'}
      </span>
    </div>
  </div>
);

export default RangeParam;