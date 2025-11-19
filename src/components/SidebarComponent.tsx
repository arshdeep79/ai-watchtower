import React from 'react';
import { X } from 'lucide-react';
import CreateWatchFormComponent from './CreateWatchFormComponent';
import * as GeoJSON from 'geojson';

export interface SidebarProps {
  isOpen: boolean;
  feature: GeoJSON.Feature | null;
  onClose: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ isOpen, feature, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create Watch</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {feature && (
            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">Selected Area</p>
                <p className="text-sm text-gray-800">
                  120k Square kilometers
                </p>
              </div>
              
              <CreateWatchFormComponent onSubmitSuccess={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
