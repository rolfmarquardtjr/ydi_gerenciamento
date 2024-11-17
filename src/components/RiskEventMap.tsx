import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import { useTelemetryStore } from '../store/telemetryStore';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issues
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconUrl = iconUrl;
DefaultIcon.options.iconShadowUrl = iconShadowUrl;

const RiskEventMap = () => {
  const events = useTelemetryStore((state) => state.events);
  
  // Center coordinates for Brazil (approximately Brasília)
  const defaultCenter: [number, number] = [-15.77972, -47.92972];
  const defaultZoom = 4;

  const getEventIcon = (evento: string) => {
    const iconSize: [number, number] = [25, 25];
    let iconSvg = '';
    
    switch (evento.toLowerCase()) {
      case 'excesso de velocidade':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z"/></svg>`;
        break;
      case 'frenagem brusca':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>`;
        break;
      case 'curva acentuada':
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="yellow" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.55a8 8 0 0 0-6 14.9M15 4.55a8 8 0 0 1 0 15.9"/></svg>`;
        break;
      default:
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
    }
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(iconSvg)}`,
      iconSize,
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  const getEventColor = (evento: string) => {
    switch (evento.toLowerCase()) {
      case 'excesso de velocidade':
        return 'text-red-500';
      case 'frenagem brusca':
        return 'text-orange-500';
      case 'curva acentuada':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  // Filter out any events with invalid coordinates
  const validEvents = events.filter(
    event => 
      typeof event.latitude === 'number' && 
      typeof event.longitude === 'number' &&
      !isNaN(event.latitude) && 
      !isNaN(event.longitude) &&
      event.latitude >= -33.7683 && // Southernmost point of Brazil
      event.latitude <= 5.2717 && // Northernmost point of Brazil
      event.longitude >= -73.9855 && // Westernmost point of Brazil
      event.longitude <= -34.7299 // Easternmost point of Brazil
  );

  if (!validEvents.length) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Nenhum evento de risco registrado</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {validEvents.map((event, index) => (
          <Marker
            key={`${event.id_operador}-${index}`}
            position={[event.latitude, event.longitude]}
            icon={getEventIcon(event.evento)}
          >
            <Popup>
              <div className="p-2">
                <h3 className={`font-semibold ${getEventColor(event.evento)}`}>
                  {event.evento}
                </h3>
                <p className="text-sm text-gray-600">
                  Motorista: {event.nome_operador}
                </p>
                <p className="text-sm text-gray-600">
                  Data: {new Date(event.data).toLocaleString('pt-BR')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RiskEventMap;