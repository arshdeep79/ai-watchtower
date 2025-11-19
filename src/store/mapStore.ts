import { create } from 'zustand';
import { Map as MaplibreMap } from 'maplibre-gl';
import * as GeoJSON from 'geojson';
import type { ContextMenuPosition } from '../components/ContextMenu';

export interface MapState {
  map: MaplibreMap | null;
  isDrawing: boolean;
  drawnFeatures: GeoJSON.Feature[];
  contextMenu: {
    position: ContextMenuPosition | null;
    feature: GeoJSON.Feature | null;
  };
  sidebar: {
    isOpen: boolean;
    feature: GeoJSON.Feature | null;
  };
  notificationSidebar: {
    isOpen: boolean;
  };
  setMap: (map: MaplibreMap | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setDrawnFeatures: (features: GeoJSON.Feature[]) => void;
  addDrawnFeature: (feature: GeoJSON.Feature) => void;
  clearDrawnFeatures: () => void;
  setContextMenu: (position: ContextMenuPosition | null, feature: GeoJSON.Feature | null) => void;
  closeContextMenu: () => void;
  openSidebar: (feature: GeoJSON.Feature) => void;
  closeSidebar: () => void;
  openNotificationSidebar: () => void;
  closeNotificationSidebar: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  isDrawing: false,
  drawnFeatures: [],
  contextMenu: {
    position: null,
    feature: null,
  },
  sidebar: {
    isOpen: false,
    feature: null,
  },
  notificationSidebar: {
    isOpen: false,
  },
  setMap: (map) => set({ map }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setDrawnFeatures: (drawnFeatures) => set({ drawnFeatures }),
  addDrawnFeature: (feature) => set((state) => ({ 
    drawnFeatures: [...state.drawnFeatures, feature] 
  })),
  clearDrawnFeatures: () => set({ drawnFeatures: [] }),
  setContextMenu: (position, feature) => set({ 
    contextMenu: { position, feature } 
  }),
  closeContextMenu: () => set({ 
    contextMenu: { position: null, feature: null } 
  }),
  openSidebar: (feature) => set({ 
    sidebar: { isOpen: true, feature } 
  }),
  closeSidebar: () => set({ 
    sidebar: { isOpen: false, feature: null } 
  }),
  openNotificationSidebar: () => set({ 
    notificationSidebar: { isOpen: true } 
  }),
  closeNotificationSidebar: () => set({ 
    notificationSidebar: { isOpen: false } 
  }),
}));

// Selectors to avoid unnecessary re-renders
export const useContextMenu = () => useMapStore((state) => state.contextMenu);
export const useCloseContextMenu = () => useMapStore((state) => state.closeContextMenu);
export const useSetIsDrawing = () => useMapStore((state) => state.setIsDrawing);
export const useClearDrawnFeatures = () => useMapStore((state) => state.clearDrawnFeatures);
export const useSidebar = () => useMapStore((state) => state.sidebar);
export const useOpenSidebar = () => useMapStore((state) => state.openSidebar);
export const useCloseSidebar = () => useMapStore((state) => state.closeSidebar);
export const useNotificationSidebar = () => useMapStore((state) => state.notificationSidebar);
export const useOpenNotificationSidebar = () => useMapStore((state) => state.openNotificationSidebar);
export const useCloseNotificationSidebar = () => useMapStore((state) => state.closeNotificationSidebar);
