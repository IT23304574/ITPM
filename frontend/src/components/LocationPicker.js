import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in React Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map clicks
const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const LocationPicker = ({ onConfirm, onClose }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = async (latlng) => {
    setLoading(true);
    try {
      // Reverse geocoding using OpenStreetMap Nominatim API (Free)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      // Use the display name from the API
      setAddress(data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress(`${latlng.lat}, ${latlng.lng}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-3xl h-[500px] flex flex-col relative">
        <div className="p-4 bg-gray-800 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Pick Location on Map</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="flex-grow relative">
             <MapContainer 
                center={[6.9271, 79.8612]} // Default center: Colombo, Sri Lanka
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={handleLocationSelect} />
            </MapContainer>
             {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[1000]">
                    <div className="bg-white p-3 rounded shadow font-bold">Finding address...</div>
                </div>
            )}
        </div>

        <div className="p-4 bg-gray-100 rounded-b-lg flex justify-between items-center gap-4">
            <div className="text-sm text-gray-800 truncate flex-grow">
                {address || "Click on the map to select a location"}
            </div>
            <button 
                onClick={() => onConfirm(address)}
                disabled={!address}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold disabled:bg-gray-400 transition"
            >
                Select Location
            </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
