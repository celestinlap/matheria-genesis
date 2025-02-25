import React, { useRef, useEffect } from 'react';
import { calculateHeight, getFunctionName, getOperationSymbol } from '../../utils/MathFunctions';

function FunctionVisualizer({ functions, width = 300, height = 100 }) {
  const canvasRef = useRef(null);

  const drawFunction = (ctx) => {
    ctx.clearRect(0, 0, width, height);
    
    // Configuration de base
    ctx.lineWidth = 2;
    
    // Axes
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();

    // On calcule chaque fonction séparément
    const allPoints = functions.map((func, index) => {
      const points = [];
      let maxY = 0;

      const funcWeight = func.weight || 1;

      for(let x = 0; x < width; x++) {
        // On normalise entre -2 et 2 pour que ça s'affiche sur ce range
        const xNorm = (x - width/2) / (width/4); 
        
        // On utilise la fonction pour calculer la hauteur, 0 est utilisé comme zVal car on est juste sur l'axe des x
        let y = calculateHeight(func.type, xNorm, 0, func.parameters);
        
        y *= funcWeight;

        // Y est inversé dans le canvas (0 en haut, height en bas)
        y = -y;

        maxY = Math.max(maxY, Math.abs(y));
        points.push([x, y]);
      }

      return { points, maxY, operation: func.operation || 'add' };
    });

    // Trouver la valeur Y maximale globale pour la normalisation
    const globalMaxY = Math.max(...allPoints.map(p => p.maxY), 0.1); 
    const scale = height / (4 * globalMaxY);

    // Dessiner chaque fonction avec une couleur différente
    allPoints.forEach(({ points, operation }, index) => {
      ctx.beginPath();
      ctx.strokeStyle = getColorForIndex(index);
      
      // Dessiner la courbe
      ctx.moveTo(points[0][0], (points[0][1] * scale) + height/2);
      points.forEach(point => {
        const y = (point[1] * scale) + height/2;
        if (y >= 0 && y <= height) {
          ctx.lineTo(point[0], y);
        }
      });
      ctx.stroke();
    });

    drawLegend(ctx, functions);
  };

  // On obtient une couleur unique pour chaque fonction
  const getColorForIndex = (index) => {
    const colors = [
      'royalblue',
      'mediumseagreen',
      'darkorange',
      'firebrick',
      'mediumpurple',
      'deeppink',
      'darkcyan',
      'teal'
     ];
    return colors[index % colors.length];
  };

  const drawLegend = (ctx, functions) => {
    const legendPadding = 10;
    const itemHeight = 20;
    
    functions.forEach((func, index) => {
      const x = legendPadding;
      const y = legendPadding + (itemHeight * index);
      
      ctx.fillStyle = getColorForIndex(index);
      ctx.fillRect(x, y, 10, 10);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      
      const funcName = getFunctionName(func.type);
      
      let opSymbol = '';
      if (index > 0) {
        opSymbol = `[${getOperationSymbol(func.operation)}] `;
      }
      
      ctx.fillText(
        `${opSymbol}${funcName} (×${func.weight?.toFixed(1) || '1.0'})`, 
        x + 15, 
        y + 8
      );
    });
  };

  // Initialise et dessine le canva :)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    drawFunction(ctx);
  }, [functions, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '15px'
      }}
    />
  );
}

export default FunctionVisualizer;