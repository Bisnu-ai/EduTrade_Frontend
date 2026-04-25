"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Fix for Leaflet default icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MeetupMapProps {
  onSelect: (lat: number, lng: number) => void;
}

export default function MeetupMap({ onSelect }: MeetupMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  // IGIT Sarang Coordinates (Example center)
  const center: [number, number] = [20.9168, 85.1611];

  function SearchControl() {
    const map = useMapEvents({});
    
    useEffect(() => {
      // Create provider with some localized bias for better results
      const provider = new OpenStreetMapProvider({
        params: {
          'accept-language': 'en',
          countrycodes: 'in',
          viewbox: '85.0,20.8,85.3,21.0', // Bias around Sarang/Angul area
        },
      });

      const searchControl = new (GeoSearchControl as any)({
        provider,
        style: "bar",
        showMarker: true,
        showPopup: true,
        autoComplete: true,
        autoCompleteDelay: 250,
        popupFormat: ({ result }: any) => result.label,
        marker: { icon: defaultIcon },
        maxMarkers: 1,
        retainZoomLevel: false,
        animateZoom: true,
        autoClose: true,
        searchLabel: "Enter place name...",
        keepResult: true,
        updateMap: true,
      });

      map.addControl(searchControl);
      
      const handleShowLocation = (result: any) => {
        if (result && result.location) {
          const { x, y } = result.location;
          setPosition([y, x]);
          onSelect(y, x);
          map.flyTo([y, x], 17);
        }
      };

      map.on("geosearch/showlocation", handleShowLocation);

      return () => { 
        map.off("geosearch/showlocation", handleShowLocation);
        map.removeControl(searchControl); 
      };
    }, [map]);

    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={defaultIcon}>
        <Popup>Meet here! 🤝</Popup>
      </Marker>
    );
  }

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-primary/20 shadow-inner cursor-grab active:cursor-grabbing relative">
      <MapContainer 
        center={center} 
        zoom={16} 
        scrollWheelZoom={true}
        dragging={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Google Maps">
            <TileLayer
              attribution="Google Maps"
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="Google Maps Satellite"
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution="Google Maps Terrain"
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <SearchControl />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
