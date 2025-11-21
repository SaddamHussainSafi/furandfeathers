import React, { useEffect, useRef, useState } from 'react';
import useGoogleMapsApi from '../../hooks/useGoogleMapsApi';
import '../../styles/map.css';

const DEFAULT_CENTER = { lat: 37.773972, lng: -122.431297 };

export default function PetLocationMap({ address, petName }) {
  const { isLoaded, error } = useGoogleMapsApi();
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [formattedAddress, setFormattedAddress] = useState(address);

  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!address || !isLoaded || !geocoderRef.current || !mapRef.current) return;
    setStatus('loading');
    geocoderRef.current.geocode({ address }, (results, geoStatus) => {
      if (geoStatus === 'OK' && results?.[0]) {
        const result = results[0];
        const location = result.geometry.location;
        setFormattedAddress(result.formatted_address);
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 13,
          disableDefaultUI: true,
          mapTypeControl: false
        });
        new window.google.maps.Marker({
          map,
          position: location,
          title: petName || 'Pet location'
        });
        setStatus('ready');
      } else {
        setStatus('error');
      }
    });
  }, [address, isLoaded, petName]);

  const directionsHref = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : '#';

  return (
    <div className="pet-location-map">
      <div className="pet-location-map__header">
        <div>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Visit location
          </span>
          <strong>{formattedAddress}</strong>
        </div>
        <a
          className="site-button site-button--secondary"
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions
        </a>
      </div>
      <div className="pet-location-map__canvas">
        {status === 'ready' && <div ref={mapRef} />}
        {status === 'loading' && <div className="pet-location-map__status">Locating address...</div>}
        {status === 'error' && (
          <div className="pet-location-map__status">
            {error ? 'Maps unavailable. Check API key.' : 'Unable to render location on map.'}
          </div>
        )}
      </div>
    </div>
  );
}
