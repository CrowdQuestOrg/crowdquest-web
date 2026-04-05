import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GeofenceCircleMapProps {
  onChange: (center: [number, number], radius: number) => void;
  initialCenter?: [number, number];
  initialRadius?: number;
  height?: string;
}

const regionPresets: Record<string, { center: [number, number]; radius: number }> = {
  amhara: { center: [12.0, 37.5], radius: 100000 },
  oromia: { center: [7.5, 39.0], radius: 120000 },
  tigray: { center: [13.5, 39.0], radius: 80000 },
  somali: { center: [7.0, 43.0], radius: 150000 },
  benishangul: { center: [10.5, 35.5], radius: 80000 },
  addis_ababa: { center: [9.03, 38.74], radius: 30000 },
};

export const GeofenceCircleMap = ({ 
  onChange, 
  initialCenter = [9.03, 38.74], 
  initialRadius = 50000,
  height = '500px'
}: GeofenceCircleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [radius, setRadius] = useState<number>(initialRadius);
  const [latInput, setLatInput] = useState<string>(initialCenter[0].toString());
  const [lngInput, setLngInput] = useState<string>(initialCenter[1].toString());
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    // Wait for the ref to be attached to the DOM
    if (!mapRef.current || mapInstanceRef.current) return;

    // Small delay to ensure the DOM element is fully ready
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      try {
        const mapInstance = L.map(mapRef.current).setView(center, 7);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        mapInstanceRef.current = mapInstance;
        setIsMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center]);

  // Update circle and marker when map is ready or center/radius changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing circle and marker
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // Add new marker
    const marker = L.marker(center).addTo(map);
    markerRef.current = marker;

    // Add new circle
    const circle = L.circle(center, {
      radius: radius,
      color: '#006666',
      fillColor: '#006666',
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(map);
    circleRef.current = circle;

    // Fit bounds to show the circle
    map.fitBounds(circle.getBounds(), { padding: [50, 50] });
  }, [isMapReady, center, radius]);

  // Handle map click
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newCenter: [number, number] = [e.latlng.lat, e.latlng.lng];
      setCenter(newCenter);
      setLatInput(e.latlng.lat.toFixed(6));
      setLngInput(e.latlng.lng.toFixed(6));
      onChange(newCenter, radius);
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isMapReady, radius, onChange]);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    onChange(center, newRadius);
  };

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const newCenter: [number, number] = [lat, lng];
      setCenter(newCenter);
      onChange(newCenter, radius);
    } else {
      alert('Please enter valid coordinates (Lat: -90 to 90, Lng: -180 to 180)');
    }
  };

  const handleRegionSelect = (regionKey: string) => {
    const preset = regionPresets[regionKey];
    if (preset) {
      setCenter(preset.center);
      setLatInput(preset.center[0].toString());
      setLngInput(preset.center[1].toString());
      setRadius(preset.radius);
      onChange(preset.center, preset.radius);
    }
  };

  const formatRadius = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%', borderRadius: '0.5rem', minHeight: height }} 
        className="border border-gray-200 z-10 bg-gray-50"
      />
      
      {!isMapReady && (
        <div className="text-center text-gray-500 py-4">
          Loading map...
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Crisis Center Coordinates
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="Latitude"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              step="any"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              placeholder="Longitude"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleCoordinateSubmit}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Set
            </button>
          </div>
          <p className="text-xs text-gray-500">
            💡 Click on the map to set center point, or enter coordinates manually
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Coverage Radius: {formatRadius(radius)}
          </label>
          <input
            type="range"
            min="1000"
            max="200000"
            step="1000"
            value={radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            className="accent-primary w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>50 km</span>
            <span>100 km</span>
            <span>200 km</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select Regions
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(regionPresets).map(region => (
            <button
              key={region}
              type="button"
              onClick={() => handleRegionSelect(region)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors capitalize"
            >
              {region.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            The translucent circle shows the crisis area. All beneficiaries within this radius will be eligible for aid.
            {radius >= 100000 && <span className="font-semibold ml-2">Large area detected - consider splitting into multiple programs for better coverage.</span>}
          </span>
        </p>
      </div>
    </div>
  );
};