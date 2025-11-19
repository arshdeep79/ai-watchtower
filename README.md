# AI Watch Tower - Mapping Application

A modern mapping application built with MapLibre GL JS, React, TypeScript, and Vite, featuring satellite imagery from MapTiler and drawing tools.

## Tech Stack

- **Map Engine**: MapLibre GL JS
- **UI Framework**: Vite + React + TypeScript
- **State Management**: Zustand
- **Imagery Source**: MapTiler Satellite (Free Tier)
- **Drawing Tools**: mapbox-gl-draw
- **Styling**: Tailwind CSS

## Features

- 🗺️ Interactive satellite map using MapLibre GL JS
- ✏️ Drawing tools for points, lines, and polygons
- 🎨 Clean, modern UI with Tailwind CSS
- 📊 State management with Zustand
- 🔧 TypeScript for type safety
- 📍 Map navigation controls (zoom, pan, rotate)
- 📏 Scale control
- 🗑️ Clear all drawings functionality

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-watch-tower/poc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### MapTiler API Key Setup

1. Sign up for a free account at [MapTiler](https://www.maptiler.com/)
2. Get your API key from the dashboard
3. Replace `YOUR_MAPTILER_API_KEY` in `src/components/MapComponent.tsx` with your actual API key:

   ```typescript
   const MAPTILER_API_KEY = 'your-actual-api-key-here';
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

### Building for Production

```bash
npm run build
```

## Usage

### Map Controls

- **Navigation**: Use mouse/touch to pan, scroll to zoom
- **Drawing Tools**: Located in the top-left panel
  - **Add Point**: Click to place points on the map
  - **Draw Line**: Click multiple points to create a line
  - **Draw Polygon**: Click multiple points to create a polygon
  - **Stop Drawing**: Return to selection mode
  - **Clear All**: Remove all drawn features

### State Management

The application uses Zustand for state management, which tracks:
- Map instance
- Drawing mode status
- Drawn features (GeoJSON format)

## Project Structure

```
src/
├── components/
│   └── MapComponent.tsx     # Main map component with drawing tools
├── store/
│   └── mapStore.ts          # Zustand store for map state
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## Key Dependencies

- `maplibre-gl`: Open-source map rendering engine
- `@mapbox/mapbox-gl-draw`: Drawing tools for maps
- `zustand`: Lightweight state management
- `react`: UI framework
- `typescript`: Type safety
- `tailwindcss`: Utility-first CSS framework
- `vite`: Build tool and dev server

## API Key Notes

- MapTiler offers a generous free tier suitable for development and small projects
- The application will display a warning if using the placeholder API key
- Monitor your usage on the MapTiler dashboard to stay within free tier limits

## Troubleshooting

### Common Issues

1. **Map not loading**: Check your MapTiler API key is correctly set
2. **Drawing tools not working**: Ensure the map has fully loaded before using drawing tools
3. **TypeScript errors**: Some `any` types are used due to limited type definitions for mapbox-gl-draw

### Development Notes

- The application uses `@ts-expect-error` for mapbox-gl-draw imports due to limited TypeScript support
- ESLint warnings about `any` types are acceptable for drawing event handlers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
