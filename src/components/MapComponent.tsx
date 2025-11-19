import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
// @ts-expect-error - mapbox-gl-draw doesn't have proper TypeScript definitions
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useMapStore, useContextMenu, useCloseContextMenu, useSidebar, useOpenSidebar, useCloseSidebar, useNotificationSidebar, useOpenNotificationSidebar, useCloseNotificationSidebar } from '../store/mapStore';
import DrawingControls from './DrawingControls';
import SearchComponent from './SearchComponent';
import ContextMenu from './ContextMenu';
import SidebarComponent from './SidebarComponent';
import NotificationButton from './NotificationButton';
import NotificationSidebar from './NotificationSidebar';
import * as GeoJSON from 'geojson';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// MapTiler API Key Configuration
// Option 1: Use environment variable (recommended for production)
// Create a .env file in the project root with: VITE_MAPTILER_API_KEY=your-key-here
const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY';

// Option 2: Hardcode your key here (for quick testing)
// const MAPTILER_API_KEY = 'your-actual-api-key-here'; // Example: 'abcdefghijklmnop123456789'

// To get your free API key:
// 1. Go to https://www.maptiler.com/ and sign up for a free account
// 2. Go to your dashboard > Keys
// 3. Copy your default API key
// 4. Either create a .env file (recommended) or replace the placeholder above

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const contextMenu = useContextMenu();
  const closeContextMenu = useCloseContextMenu();
  const sidebar = useSidebar();
  const openSidebar = useOpenSidebar();
  const closeSidebar = useCloseSidebar();
  const notificationSidebar = useNotificationSidebar();
  const openNotificationSidebar = useOpenNotificationSidebar();
  const closeNotificationSidebar = useCloseNotificationSidebar();

  // Handle search functionality
  const handleSearch = useCallback((query: string) => {
    // For now, we'll just log the search query
    // In a real implementation, you would integrate with a geocoding service
    console.log('Searching for:', query);

    // Example: You could use a geocoding API here to get coordinates
    // and then fly the map to that location
    // For demonstration, we'll just show an alert
    if (map.current) {
      // This is where you would typically:
      // 1. Call a geocoding API to get coordinates for the query
      // 2. Fly the map to those coordinates
      // 3. Optionally add markers or other visual indicators

      // For demo purposes, we'll just scroll to Israel coordinates
      if (query.toLowerCase().includes('israel')) {
        map.current.flyTo({
          center: [35.2433, 31.7683], // Israel approximate center
          zoom: 8,
          essential: true
        });
      }
    }
  }, []);

  // Handle context menu actions
  const handleStartWatch = useCallback((feature: GeoJSON.Feature) => {
    console.log('Starting watch for feature:', feature);
    openSidebar(feature);
  }, [openSidebar]);

  const handleDeleteFeature = useCallback((feature: GeoJSON.Feature) => {
    if (draw.current && feature.id) {
      draw.current.delete(feature.id as string);
      console.log('Deleted feature:', feature);
    }
  }, []);

  // Handle notification button click
  const handleNotificationClick = useCallback(() => {
    console.log('Notification button clicked');
    openNotificationSidebar();
  }, [openNotificationSidebar]);

  // Handle right-click on drawn features
  const handleContextMenu = useCallback((event: maplibregl.MapMouseEvent) => {
    event.preventDefault();

    if (map.current && draw.current) {
      // Query features at the clicked point
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: [] // Query all layers including draw layers
      });

      // Also check draw features specifically
      const drawFeatures = draw.current.getAll().features;
      const clickedFeature = features.find(feature =>
        drawFeatures.some((drawFeature: GeoJSON.Feature) =>
          drawFeature.id === feature.id ||
          (feature.properties && Object.prototype.hasOwnProperty.call(feature.properties, 'user_' + feature.type))
        )
      );

      if (clickedFeature || (drawFeatures && drawFeatures.length > 0)) {
        const feature = clickedFeature || drawFeatures[0];
        const rect = map.current?.getContainer().getBoundingClientRect();

        if (rect) {
          const x = event.originalEvent.clientX;
          const y = event.originalEvent.clientY;
          // Get store function inside callback to avoid dependency issues
          const { setContextMenu } = useMapStore.getState();
          console.log('Setting context menu for feature:', feature); // Debug log
          setContextMenu({ x, y }, feature);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
      center: [-74.0060, 40.7128], // New York coordinates
      zoom: 12,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    // Initialize drawing tools with MapLibre-compatible styles
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
      defaultMode: 'simple_select',
      styles: [
        // Line styles
        {
          id: 'gl-draw-lines',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#3bb2d0',
            'line-width': 3
          }
        },
        {
          id: 'gl-draw-lines-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#fbb03b',
            'line-width': 3
          }
        },
        // Polygon styles
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#3bb2d0',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          paint: {
            'fill-color': '#fbb03b',
            'fill-outline-color': '#fbb03b',
            'fill-opacity': 0.1
          }
        },
        {
          id: 'gl-draw-polygon-outline',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#3bb2d0',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-outline-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#fbb03b',
            'line-width': 2
          }
        },
        // Point styles
        {
          id: 'gl-draw-points',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#3bb2d0',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2
          }
        },
        {
          id: 'gl-draw-points-active',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true']],
          paint: {
            'circle-radius': 7,
            'circle-color': '#fbb03b',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2
          }
        }
      ]
    });

    map.current.on('load', () => {
      // Get store functions inside event handler to avoid dependency issues
      const { setMap } = useMapStore.getState();
      setMap(map.current);

      if (map.current && draw.current) {
        map.current.addControl(draw.current);
      }
    });

    // Handle drawing events
    map.current.on('draw.create', (e: { features: GeoJSON.Feature[] }) => {
      const { addDrawnFeature } = useMapStore.getState();
      const feature = e.features[0];
      addDrawnFeature(feature);
    });

    map.current.on('draw.delete', () => {
      // Update state when features are deleted
      const { clearDrawnFeatures } = useMapStore.getState();
      clearDrawnFeatures();
    });

    map.current.on('draw.update', (e: { features: GeoJSON.Feature[] }) => {
      // Update state when features are modified
      const { clearDrawnFeatures, addDrawnFeature } = useMapStore.getState();
      clearDrawnFeatures();
      e.features.forEach((feature: GeoJSON.Feature) => addDrawnFeature(feature));
    });

    // Handle context menu on drawn features
    map.current.on('contextmenu', handleContextMenu);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-initialization


  return (
    <div className="w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0 w-full h-screen" />

      {/* Search Component */}
      <SearchComponent onSearch={handleSearch} />

      {/* Drawing Controls */}
      <DrawingControls draw={draw} map={map} />

      {/* Context Menu */}
      <ContextMenu
        position={contextMenu.position}
        feature={contextMenu.feature}
        onClose={closeContextMenu}
        onStartWatch={handleStartWatch}
        onDelete={handleDeleteFeature}
      />

      {/* Sidebar Component */}
      <SidebarComponent
        isOpen={sidebar.isOpen}
        feature={sidebar.feature}
        onClose={closeSidebar}
      />

      {/* Notification Button */}
      <NotificationButton 
        notificationCount={3} 
        onClick={handleNotificationClick} 
      />

      {/* Notification Sidebar */}
      <NotificationSidebar 
        isOpen={notificationSidebar.isOpen} 
        onClose={closeNotificationSidebar} 
      />

      {/* API Key Notice */}
      {MAPTILER_API_KEY === 'YOUR_MAPTILER_API_KEY' && (
        <div className="absolute bottom-4 left-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 z-10 max-w-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Please replace 'YOUR_MAPTILER_API_KEY' with a free API key from{' '}
            <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer" className="underline">
              MapTiler
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
