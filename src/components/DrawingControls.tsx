import React from 'react';
// @ts-expect-error - mapbox-gl-draw doesn't have proper TypeScript definitions
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import maplibregl from 'maplibre-gl';
import { useSetIsDrawing, useClearDrawnFeatures } from '../store/mapStore';

interface DrawingControlsProps {
  draw: React.MutableRefObject<MapboxDraw | null>;
  map: React.MutableRefObject<maplibregl.Map | null>;
}

const DrawingControls: React.FC<DrawingControlsProps> = ({ draw, map }) => {
  const setIsDrawing = useSetIsDrawing();
  const clearDrawnFeatures = useClearDrawnFeatures();

  const toggleDrawingMode = (mode: 'draw_polygon') => {
    if (draw.current && map.current) {
      draw.current.changeMode(mode);
      setIsDrawing(true);
    }
  };

  const clearAllDrawings = () => {
    if (draw.current && map.current) {
      draw.current.deleteAll();
      clearDrawnFeatures();
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white rounded shadow-md shadow-black/20 z-10">
      <div className="flex flex-col">
        <button
          onClick={() => toggleDrawingMode('draw_polygon')}
          className="p-2 bg-white text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Draw Polygon"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>

        <button
          onClick={clearAllDrawings}
          className="p-2 bg-white text-gray-700 hover:bg-gray-100 transition-colors rounded-b"
          title="Clear All"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DrawingControls;
