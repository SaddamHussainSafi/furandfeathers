import { useEffect, useState } from 'react';

let googleMapsPromise;

const loadGoogleMapsScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not defined'));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is missing. Set VITE_GOOGLE_MAPS_API_KEY.'));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export default function useGoogleMapsApi() {
  const [state, setState] = useState({
    isLoaded: !!(typeof window !== 'undefined' && window.google && window.google.maps),
    error: null
  });

  useEffect(() => {
    if (state.isLoaded) return;
    let isMounted = true;

    loadGoogleMapsScript()
      .then(() => {
        if (isMounted) {
          setState({ isLoaded: true, error: null });
        }
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API', error);
        if (isMounted) {
          setState({ isLoaded: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [state.isLoaded]);

  return state;
}
