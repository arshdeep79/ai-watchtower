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
import type { Alert } from '../data/alertsData';
import { alertsData } from '../data/alertsData';
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

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: { coordinates: [number, number]; zoom: number }) => {
    console.log('Selected suggestion:', suggestion);

    if (map.current) {
      // Fly to the coordinates from the suggestion
      map.current.flyTo({
        center: [suggestion.coordinates[1], suggestion.coordinates[0]], // Note: MapLibre uses [lng, lat] format
        zoom: suggestion.zoom,
        essential: true
      });
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

  // Function to calculate optimal popup position based on feature geometry
  const getPopupPositionForFeature = useCallback((
    feature: GeoJSON.Feature,
    fallbackCoordinates: [number, number]
  ): [number, number] => {
    if (!feature.geometry) return fallbackCoordinates;

    const { type } = feature.geometry;

    switch (type) {
      case 'Point': {
        return (feature.geometry as GeoJSON.Point).coordinates as [number, number];
      }
      
      case 'Polygon': {
        // Calculate the centroid of the polygon
        const polygonCoords = (feature.geometry as GeoJSON.Polygon).coordinates;
        const exteriorRing = polygonCoords[0]; // Use the exterior ring
        
        // Calculate centroid using the polygon vertices
        let centroidLng = 0;
        let centroidLat = 0;
        let validPoints = 0;
        
        exteriorRing.forEach(coord => {
          if (coord.length >= 2 && !isNaN(coord[0]) && !isNaN(coord[1])) {
            centroidLng += coord[0];
            centroidLat += coord[1];
            validPoints++;
          }
        });
        
        if (validPoints > 0) {
          return [centroidLng / validPoints, centroidLat / validPoints];
        }
        
        // Fallback to bounds calculation
        const bounds = new maplibregl.LngLatBounds();
        exteriorRing.forEach(coord => {
          if (coord.length >= 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
        
        return bounds.getCenter().toArray();
      }
      
      case 'LineString': {
        // For lines, find the midpoint
        const lineCoords = (feature.geometry as GeoJSON.LineString).coordinates;
        if (lineCoords.length >= 2) {
          const midIndex = Math.floor(lineCoords.length / 2);
          return lineCoords[midIndex].slice(0, 2) as [number, number];
        }
        return fallbackCoordinates;
      }
      
      case 'MultiPoint': {
        // For multiple points, use the first point or calculate centroid
        const multiPointCoords = (feature.geometry as GeoJSON.MultiPoint).coordinates;
        if (multiPointCoords.length > 0) {
          return multiPointCoords[0].slice(0, 2) as [number, number];
        }
        return fallbackCoordinates;
      }
      
      default:
        return fallbackCoordinates;
    }
  }, []);

  // Function to clean up all alert features and popups
  const cleanupAlertFeatures = useCallback(() => {
    if (map.current) {
      // Remove alert layers
      if (map.current.getLayer('alert-features-layer')) {
        map.current.removeLayer('alert-features-layer');
      }
      if (map.current.getLayer('alert-features-outline')) {
        map.current.removeLayer('alert-features-outline');
      }
      
      // Remove alert source
      if (map.current.getSource('alert-features-source')) {
        map.current.removeSource('alert-features-source');
      }
      
      // Close all popups
      const popups = document.querySelectorAll('.maplibregl-popup');
      popups.forEach(popup => popup.remove());
    }
  }, []);

  // Handle alert click - navigate to alert location on map and draw features
  const handleAlertClick = useCallback((alert: Alert) => {
    console.log('Alert clicked:', alert);

    if (map.current) {
      // Remove any existing alert features and popups first
      cleanupAlertFeatures();

      // Set zoom to 16 for all alerts as requested
      const { center, pitch = 0, bearing = 0 } = alert.mapPosition;
      
      // Fly to the alert position with zoom 16
      map.current.flyTo({
        center,
        zoom: 16,
        pitch,
        bearing,
        essential: true
      });

      // Draw the alert feature on the map with new styling
      if (alert.feature.geometry) {
        // Add source for the alert feature
        map.current.addSource(`alert-features-source`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: alert.feature.geometry,
            properties: alert.feature.properties || {}
          }
        });

        // Apply new styling: stroke 2, no fill, red alert color
        const { type } = alert.feature;
        const alertRedColor = '#ef4444'; // Red alert color
        
        switch (type) {
          case 'polygon':
            // No fill, just outline
            map.current.addLayer({
              id: 'alert-features-outline',
              type: 'line',
              source: 'alert-features-source',
              paint: {
                'line-color': alertRedColor,
                'line-width': 2
              }
            });
            break;
            
          case 'line':
            map.current.addLayer({
              id: 'alert-features-layer',
              type: 'line',
              source: 'alert-features-source',
              paint: {
                'line-color': alertRedColor,
                'line-width': 2
              }
            });
            break;
            
          case 'point':
          case 'circle':
            map.current.addLayer({
              id: 'alert-features-layer',
              type: 'circle',
              source: 'alert-features-source',
              paint: {
                'circle-radius': 8,
                'circle-color': 'transparent', // No fill
                'circle-stroke-color': alertRedColor,
                'circle-stroke-width': 2,
                'circle-opacity': 0
              }
            });
            break;
        }

        // Add popup with alert information
        if (alert.feature.properties?.name) {
          // Create a proper GeoJSON Feature from the alert feature data
          const geoFeature: GeoJSON.Feature = {
            type: 'Feature',
            geometry: alert.feature.geometry,
            properties: alert.feature.properties || {}
          };

          // Calculate optimal popup position based on feature geometry
          const popupPosition = getPopupPositionForFeature(
            geoFeature,
            alert.coordinates
          );

          const popup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: false,
            offset: [0, -10] // Offset to position popup above the feature
          }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${alert.title}</h3>
              <p class="text-xs text-gray-600 mt-1">${alert.feature.properties.name}</p>
              ${alert.feature.properties.vehicleCount ? `<p class="text-xs text-gray-500">Vehicles: ${alert.feature.properties.vehicleCount}</p>` : ''}
              ${alert.feature.properties.intensity ? `<p class="text-xs text-gray-500">Intensity: ${alert.feature.properties.intensity}</p>` : ''}
            </div>
          `);
          
          // Show popup at the calculated optimal position
          popup.setLngLat(popupPosition).addTo(map.current);
        }
      }

      // Keep the notification sidebar open for continued interaction
    }
  }, [cleanupAlertFeatures, getPopupPositionForFeature]);

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
      center: [54.4156268, 24.4525537], // Default coordinates: 24.4525537, 54.4156268
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
      console.log('Drawn shape GeoJSON:', feature);
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

  // Enhanced closeNotificationSidebar to also clean up alert features
  const handleCloseNotificationSidebar = useCallback(() => {
    cleanupAlertFeatures();
    closeNotificationSidebar();
  }, [cleanupAlertFeatures, closeNotificationSidebar]);

  return (
    <div className="w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0 w-full h-screen" />

      {/* Search Component */}
      <SearchComponent onSearch={handleSearch} onSuggestionSelect={handleSuggestionSelect} />

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
        notificationCount={alertsData.length}
        onClick={handleNotificationClick}
      />

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={notificationSidebar.isOpen}
        onClose={handleCloseNotificationSidebar}
        onAlertClick={handleAlertClick}
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
