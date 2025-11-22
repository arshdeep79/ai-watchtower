import * as GeoJSON from "geojson";

export interface AlertMapPosition {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface AlertFeature {
  type: "point" | "polygon" | "line" | "circle";
  geometry?: GeoJSON.Geometry;
  properties?: Record<string, string | number | boolean>;
  style?: {
    color?: string;
    fillColor?: string;
    strokeWidth?: number;
    fillOpacity?: number;
    radius?: number;
  };
}

export interface Alert {
  id: string;
  title: string;
  location: string;
  section: string;
  insights: string[];
  icon: string; // Icon name instead of React component
  severity: "high" | "medium" | "low";
  timestamp: string;

  // Enhanced location data
  coordinates: [number, number]; // [longitude, latitude] for map navigation
  address?: string;
  region?: string;
  country?: string;

  // Map positioning data - where to move the map when alert is clicked
  mapPosition: AlertMapPosition;

  // Feature data - what to draw on the map when alert is clicked
  feature: AlertFeature;

  // Additional metadata
  category?: string;
  source?: string;
  confidence?: number; // 0-100
  status?: "active" | "resolved" | "investigating";
  assignedTo?: string;
  tags?: string[];
}

// Comprehensive alerts data (removed unauthorized construction alert)
export const alertsData: Alert[] = [
  {
    id: "1",
    title: "New vehicles detected",
    location: "Military basecamp",
    section: "Deep Insights",
    insights: [
      "30% increase in vehicles over 1 month",
      "Unusual night activity detected",
    ],
    icon: "TrendingUp",
    severity: "medium",
    timestamp: "2 hours ago",
    coordinates: [49.4002191, 27.0405505], // North Africa coordinates
    address: "Near Tunis-Carthage Airport",
    region: "Northern Tunisia",
    country: "Tunisia",
    mapPosition: {
      center: [49.4002191, 27.0405505],
      zoom: 14,
      pitch: 0,
      bearing: 0,
    },
    feature: {
      type: "polygon",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [49.40193571376989, 27.040617392072107],
            [49.40240778255642, 27.040655616095933],
            [49.40241851139248, 27.040282931308383],
            [49.40193571376989, 27.040263819234653],
            [49.40193571376989, 27.040617392072107],
          ],
        ],
      },
      properties: {
        name: "Military Basecamp Area",
        vehicleCount: 45,
        lastActivity: new Date().toISOString(),
      },
      style: {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        strokeWidth: 2,
        fillOpacity: 0.3,
      },
    },
    category: "military",
    source: "satellite_imagery",
    confidence: 85,
    status: "active",
    tags: ["vehicles", "military", "north_africa"],
  },
  {
    id: "2",
    title: "Smoke detected",
    location: "Industrial Zone",
    section: "Surface Observations",
    insights: [
      "Spike in CO2 detector logs",
      "Unusual heat signature detected",
      "Possible fire incident",
    ],
    icon: "Flame",
    severity: "high",
    timestamp: "1 hour ago",
    coordinates: [55.316612230452535, 24.181269031333503], // Israel coordinates
    address: "Industrial Area, Ashdod",
    region: "Southern District",
    country: "Israel",
    mapPosition: {
      center: [55.316612230452535, 24.181269031333503],
      zoom: 16,
      pitch: 0,
      bearing: 0,
    },
    feature: {
      type: "polygon",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [55.31556131481881, 24.182184617771185],
            [55.31777145504657, 24.182380364705608],
            [55.31791092991597, 24.180510969224088],
            [55.3156471455066, 24.180354369406516],
            [55.31556131481881, 24.182184617771185],
          ],
        ],
      },
      properties: {
        name: "Fire Location",
        intensity: "high",
        temperature: "+45°C above ambient",
      },
      style: {
        color: "#ef4444",
        fillColor: "#ef4444",
        strokeWidth: 2,
        fillOpacity: 0.5,
        radius: 50,
      },
    },
    category: "fire",
    source: "thermal_sensors",
    confidence: 92,
    status: "active",
    tags: ["fire", "smoke", "industrial", "emergency"],
  },
  {
    id: "3",
    title: "Tents Detected",
    location: "Eastern border",
    section: "Border Security",
    insights: [
      "5 new vehicles crossing near border",
      "20 phone numbers active within 48 hours near border",
      "Temporary settlement detected",
    ],
    icon: "AlertTriangle",
    severity: "high",
    timestamp: "30 minutes ago",
    coordinates: [55.2805774, 24.2704484], // Eastern border coordinates
    address: "Near Jordan Border Crossing",
    region: "Eastern Border",
    country: "Israel",
    mapPosition: {
      center: [55.2805774, 24.2704484],
      zoom: 14,
      pitch: 0,
      bearing: 0,
    },
    feature: {
      type: "polygon",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [55.27948227061191, 24.271199432273406],
            [55.2821434235897, 24.27126412382269],
            [55.28221438766832, 24.26951204940329],
            [55.27942904755193, 24.269468921113415],
            [55.27948227061191, 24.271199432273406],
          ],
        ],
      },
      properties: {
        name: "Tent Settlement",
        estimatedOccupancy: "50-100 people",
        activityLevel: "high",
      },
      style: {
        color: "#dc2626",
        strokeWidth: 2,
        fillOpacity: 0.8,
        radius: 8,
      },
    },
    category: "security",
    source: "aerial_surveillance",
    confidence: 78,
    status: "investigating",
    tags: ["tents", "border", "security", "settlement"],
  },
];

// Helper functions for working with alerts
export const getAlertById = (id: string): Alert | undefined => {
  return alertsData.find((alert) => alert.id === id);
};

export const getAlertsBySeverity = (
  severity: "high" | "medium" | "low"
): Alert[] => {
  return alertsData.filter((alert) => alert.severity === severity);
};

export const getAlertsByCategory = (category: string): Alert[] => {
  return alertsData.filter((alert) => alert.category === category);
};

export const getActiveAlerts = (): Alert[] => {
  return alertsData.filter((alert) => alert.status === "active");
};

export const getHighConfidenceAlerts = (threshold: number = 80): Alert[] => {
  return alertsData.filter(
    (alert) => alert.confidence && alert.confidence >= threshold
  );
};
