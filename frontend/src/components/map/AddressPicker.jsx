import React, { useEffect, useRef, useState } from 'react';
import useGoogleMapsApi from '../../hooks/useGoogleMapsApi';
import '../../styles/map.css';

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // US centroid fallback

const extractCityFromComponents = (components) => {
  if (!components) return null;
  const cityComponent = components.find((component) =>
    component.types.includes('locality') || component.types.includes('postal_town')
  );
  if (cityComponent) return cityComponent.long_name;
  const adminComponent = components.find((component) => component.types.includes('administrative_area_level_1'));
  return adminComponent ? adminComponent.short_name : null;
};

export default function AddressPicker({
  label = 'Address',
  placeholder = 'Search an address',
  value,
  onChange,
  required = false,
  helperText
}) {
  const { isLoaded, error } = useGoogleMapsApi();
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapQuery, setMapQuery] = useState('');
  const [mapSelection, setMapSelection] = useState(null);
  const autocompleteRef = useRef(null);
  const placesServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (!isLoaded || autocompleteRef.current) return;
    autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    geocoderRef.current = new window.google.maps.Geocoder();
  }, [isLoaded]);

  useEffect(() => {
    if (!isMapOpen || !isLoaded || !mapContainerRef.current) return;
    const center = mapSelection?.location
      ? mapSelection.location
      : DEFAULT_CENTER;

    mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center,
      zoom: mapSelection ? 13 : 4,
      disableDefaultUI: true
    });

    markerRef.current = new window.google.maps.Marker({
      map: mapInstanceRef.current,
      position: mapSelection?.location || null
    });

    const clickListener = mapInstanceRef.current.addListener('click', (event) => {
      if (!geocoderRef.current) return;
      geocoderRef.current.geocode({ location: event.latLng }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const formatted = results[0].formatted_address;
          const location = results[0].geometry.location;
          markerRef.current.setPosition(location);
          mapInstanceRef.current.panTo(location);
          setMapSelection({
            address: formatted,
            location: location.toJSON(),
            city: extractCityFromComponents(results[0].address_components)
          });
        }
      });
    });

    return () => {
      window.google.maps.event.removeListener(clickListener);
    };
  }, [isMapOpen, isLoaded]);

  useEffect(() => {
    if (!isMapOpen || !isLoaded || !query || !geocoderRef.current) return;
    geocoderRef.current.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        setMapSelection({
          address: results[0].formatted_address,
          location: location.toJSON(),
          city: extractCityFromComponents(results[0].address_components)
        });
        mapInstanceRef.current?.setCenter(location);
        mapInstanceRef.current?.setZoom(13);
        markerRef.current?.setPosition(location);
      }
    });
  }, [isMapOpen, isLoaded, query]);

  useEffect(() => {
    if (!isMapOpen || !mapSelection?.location || !mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(mapSelection.location);
    mapInstanceRef.current.setZoom(13);
    markerRef.current?.setPosition(mapSelection.location);
  }, [isMapOpen, mapSelection]);

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setQuery(nextValue);
    onChange?.(nextValue);
    if (isLoaded && nextValue.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions({ input: nextValue }, (predictions) => {
        setSuggestions(predictions || []);
        setShowSuggestions(true);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchPlaceDetails = (prediction) =>
    new Promise((resolve, reject) => {
      if (!placesServiceRef.current) {
        resolve({ address: prediction.description });
        return;
      }
      placesServiceRef.current.getDetails(
        { placeId: prediction.place_id, fields: ['formatted_address', 'geometry', 'address_components'] },
        (details, status) => {
          if (status === 'OK' && details) {
            resolve({
              address: details.formatted_address || prediction.description,
              location: details.geometry?.location?.toJSON(),
              city: extractCityFromComponents(details.address_components)
            });
          } else {
            reject(status);
          }
        }
      );
    });

  const handleSelectPrediction = async (prediction) => {
    try {
      const result = await fetchPlaceDetails(prediction);
      setQuery(result.address);
      onChange?.(result.address);
      setSuggestions([]);
      setShowSuggestions(false);
      if (result.location) {
        setMapSelection(result);
      }
    } catch {
      setQuery(prediction.description);
      onChange?.(prediction.description);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleMapSearch = (event) => {
    event.preventDefault();
    if (!geocoderRef.current || !mapQuery) return;
    geocoderRef.current.geocode({ address: mapQuery }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        mapInstanceRef.current?.setCenter(location);
        mapInstanceRef.current?.setZoom(13);
        markerRef.current?.setPosition(location);
        setMapSelection({
          address: results[0].formatted_address,
          location: location.toJSON(),
          city: extractCityFromComponents(results[0].address_components)
        });
      }
    });
  };

  const handleUseSelection = () => {
    if (!mapSelection?.address) {
      setIsMapOpen(false);
      return;
    }
    setQuery(mapSelection.address);
    onChange?.(mapSelection.address);
    setIsMapOpen(false);
  };

  useEffect(() => {
    if (!isMapOpen) {
      setMapQuery('');
    }
  }, [isMapOpen]);

  return (
    <div className="address-picker">
      <div className="address-picker__label">
        <span>{label}</span>
        <button type="button" className="address-picker__map-trigger" onClick={() => setIsMapOpen(true)}>
          Open map
        </button>
      </div>
      <div className="address-picker__field">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={isLoaded ? placeholder : 'Loading Google Maps...'}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          required={required}
          disabled={!!error}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="address-picker__suggestions">
            {suggestions.map((prediction) => (
              <li key={prediction.place_id}>
                <button type="button" onMouseDown={() => handleSelectPrediction(prediction)}>
                  {prediction.description}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {helperText && <small className="form-helper">{helperText}</small>}
      {error && (
        <small className="form-helper form-helper--error">
          Unable to load Google Maps. Add VITE_GOOGLE_MAPS_API_KEY to .env or check your connection.
        </small>
      )}

      {isMapOpen && (
        <div className="map-overlay" role="dialog" aria-modal="true">
          <div className="map-overlay__panel">
            <header>
              <h3>Select address</h3>
              <button type="button" onClick={() => setIsMapOpen(false)}>
                Close
              </button>
            </header>
            <form className="map-overlay__search" onSubmit={handleMapSearch}>
              <input
                type="text"
                value={mapQuery}
                onChange={(event) => setMapQuery(event.target.value)}
                placeholder="Search address"
              />
              <button type="submit">Search</button>
            </form>
            <div className="map-overlay__map">
              {!isLoaded && <span>Loading map...</span>}
              <div ref={mapContainerRef} />
            </div>
            <footer>
              <div>
                <strong>{mapSelection?.address || 'Select a point on the map'}</strong>
                {mapSelection?.city && <small>{mapSelection.city}</small>}
              </div>
              <button type="button" className="site-button site-button--primary" onClick={handleUseSelection}>
                Use this location
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
