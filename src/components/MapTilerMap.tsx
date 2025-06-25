
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Attack } from '@/utils/data';

interface MapTilerMapProps {
  attacks: Attack[];
}

const MapTilerMap: React.FC<MapTilerMapProps> = ({ attacks }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const apiKey = 'Your_MapTiler_API';
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [0, 20],
      zoom: 1.5,
      pitch: 30,
      antialias: true
    });

    // Add navigation controls
    const nav = new maplibregl.NavigationControl();
    map.current.addControl(nav, 'top-right');

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl());

    // Add loading indicator
    map.current.on('loading', () => {
      if (mapContainer.current) {
        mapContainer.current.classList.add('loading');
      }
    });

    map.current.on('load', () => {
      if (mapContainer.current) {
        mapContainer.current.classList.remove('loading');
      }
    });

    const cleanupFunction = () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };

    return cleanupFunction;
  }, [apiKey]);

  // Add markers for attacks
  useEffect(() => {
    // Skip if map is not initialized
    if (!map.current) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Process attacks with coordinates
    attacks.forEach((attack) => {
      // Skip attacks without coordinates
      if (!attack.coordinates) return;
      
      try {
        const [lng, lat] = attack.coordinates;
        
        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'flex items-center justify-center';
        
        // Set marker style based on severity
        const severityClass = getSeverityClass(attack.severity);
        markerElement.innerHTML = `
          <div class="relative">
            <div class="w-4 h-4 rounded-full ${severityClass} animate-pulse-alert"></div>
            <div class="w-6 h-6 rounded-full ${severityClass} absolute -top-1 -left-1 opacity-30"></div>
          </div>
        `;
        
        // Create popup with attack details
        const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${attack.type}</h3>
              <p class="text-sm">${attack.country || 'Unknown'}</p>
              <p class="text-xs">${attack.timestamp ? new Date(attack.timestamp).toLocaleString() : 'Unknown time'}</p>
              <p class="text-xs font-semibold ${getSeverityClass(attack.severity)}">${attack.severity || 'unknown'} severity</p>
            </div>
          `);
        
        // Add marker to map
        const marker = new maplibregl.Marker(markerElement)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current);
        
        // Store marker reference for later cleanup
        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [attacks]);

  const getSeverityClass = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-700';
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <style jsx>{`
        .loading::before {
          content: 'Loading map...';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default MapTilerMap;
