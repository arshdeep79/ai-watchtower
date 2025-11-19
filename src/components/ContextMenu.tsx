import React, { useEffect, useRef } from 'react';
import * as GeoJSON from 'geojson';
import { AlertCircle, Trash2 } from 'lucide-react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuProps {
  position: ContextMenuPosition | null;
  feature: GeoJSON.Feature | null;
  onClose: () => void;
  onStartWatch: (feature: GeoJSON.Feature) => void;
  onDelete: (feature: GeoJSON.Feature) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  feature,
  onClose,
  onStartWatch,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (position && feature) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [position, feature, onClose]);

  if (!position || !feature) {
    return null;
  }

  const handleStartWatch = () => {
    onStartWatch(feature);
    onClose();
  };

  const handleDelete = () => {
    onDelete(feature);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        onClick={handleStartWatch}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors duration-150"
      >
        <AlertCircle className="w-4 h-4 text-blue-500" />
        <span>Start Watch</span>
      </button>
      
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors duration-150"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ContextMenu;
