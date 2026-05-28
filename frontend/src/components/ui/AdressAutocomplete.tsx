import { useEffect, useRef, useState } from 'react';
import { TextInput, Loader } from '@mantine/core';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Ladda scriptet en gång globalt
let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded) {
      resolve();
      return;
    }

    loadCallbacks.push(resolve);

    if (scriptLoading) return;
    scriptLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

export function AddressAutocomplete({
  value,
  onChange,
  label = 'Adress',
  placeholder = 'Sök adress...',
  error,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(scriptLoaded);

  useEffect(() => {
    if (!scriptLoaded) {
      loadGoogleMapsScript().then(() => setReady(true));
    }
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'se' },
      fields: ['formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [ready, onChange]);

  return (
    <TextInput
      ref={inputRef}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      error={error}
      rightSection={!ready ? <Loader size={14} /> : undefined}
    />
  );
}