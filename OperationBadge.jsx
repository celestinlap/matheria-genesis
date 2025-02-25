import React from 'react';
import { getOperationSymbol } from '../../utils/MathFunctions';

const styles = {
  operationTag: {
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    display: 'inline-block',
    textTransform: 'uppercase'
  },
  addOp: {
    backgroundColor: 'mintcream',
    color: 'forestgreen',
  },
  multiplyOp: {
    backgroundColor: 'aliceblue',
    color: 'royalblue',
  },
  maxOp: {
    backgroundColor: 'cornsilk',
    color: 'sienna',
  },
  minOp: {
    backgroundColor: 'lavenderblush',
    color: 'deeppink',
  }
};

const OperationBadge = ({ operation }) => {
  let style = {};
  
  switch(operation) {
    case 'add':
      style = styles.addOp;
      break;
    case 'multiply':
      style = styles.multiplyOp;
      break;
    case 'max':
      style = styles.maxOp;
      break;
    case 'min':
      style = styles.minOp;
      break;
    default:
      style = styles.addOp;
  }
  
  return (
    <span style={{...styles.operationTag, ...style}}>
      {getOperationSymbol(operation)}
    </span>
  );
};

export default OperationBadge;