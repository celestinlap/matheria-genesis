// Fonctions mathématiques partagées
 
export const calculateHeight = (type, xVal, zVal, params) => {
  switch(type) {
    case 'sine':
      return params.amplitude * (
        Math.sin(params.frequency * Math.PI * xVal) +
        Math.sin(params.frequency * Math.PI * zVal)
      );
      
    case 'quadratic':
      return params.a * (xVal * xVal + zVal * zVal) + params.k;
      
    case 'exponential':
      const distance = Math.sqrt(xVal * xVal + zVal * zVal);
      return params.scale * Math.pow(params.base, -distance);
      
    case 'tangent':
      const tanX = Math.min(Math.max(Math.tan(params.frequency * Math.PI * xVal), -10), 10);
      const tanZ = Math.min(Math.max(Math.tan(params.frequency * Math.PI * zVal), -10), 10);
      return params.amplitude * (tanX + tanZ) / 2;
      
    case 'cubic':
      const heightX = params.a * Math.pow(xVal, 3) + 
                     params.b * Math.pow(xVal, 2) + 
                     params.c * xVal + 
                     params.d;
      const heightZ = params.a * Math.pow(zVal, 3) + 
                     params.b * Math.pow(zVal, 2) + 
                     params.c * zVal + 
                     params.d;
      return (heightX + heightZ) / 2;
      
    case 'hyperbolic':
      const sinhX = Math.sinh(params.scale * xVal);
      const sinhZ = Math.sinh(params.scale * zVal);
      return params.amplitude * (sinhX + sinhZ) / 2;
      
    case 'logarithmic':
      const xValLog = Math.abs(xVal) + 0.1;
      const zValLog = Math.abs(zVal) + 0.1;
      return params.scale * (
        Math.log(xValLog) / Math.log(params.base) +
        Math.log(zValLog) / Math.log(params.base)
      );
      
    case 'rational':
      const heightXRat = xVal / (1 + params.a * xVal * xVal);
      const heightZRat = zVal / (1 + params.a * zVal * zVal);
      return params.b * (heightXRat + heightZRat);
      
    default:
      return 0;
  }
};

export const applyOperation = (value1, value2, operation) => {
  switch(operation) {
    case 'add':
      return value1 + value2;
    case 'multiply':
      return value1 * value2;
    case 'max':
      return Math.max(value1, value2);
    case 'min':
      return Math.min(value1, value2);
    default:
      return value1 + value2; 
  }
};

export const getFunctionName = (type) => {
  switch(type) {
    case 'sine': return 'Sinusoïdale';
    case 'quadratic': return 'Quadratique';
    case 'exponential': return 'Exponentielle';
    case 'tangent': return 'Tangente';
    case 'cubic': return 'Cubique';
    case 'hyperbolic': return 'Hyperbolique';
    case 'logarithmic': return 'Logarithmique';
    case 'rational': return 'Rationnelle';
    default: return type;
  }
};

export const getOperationSymbol = (operation) => {
  switch(operation) {
    case 'add': return '+';
    case 'multiply': return '×';
    case 'max': return 'max';
    case 'min': return 'min';
    default: return '+';
  }
};