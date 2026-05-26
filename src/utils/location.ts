import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AddressComponents {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  district?: string;
}

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationError';
  }
}

export const getCurrentAddress = async (): Promise<string> => {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      throw new LocationError('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (reverseGeocode.length === 0) {
      throw new LocationError('Could not reverse geocode location');
    }

    const address = reverseGeocode[0];
    const parts = [];

    if (address.name) parts.push(address.name);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country && address.country !== 'United States') parts.push(address.country);

    return parts.join(', ') || 'Location detected';
  } catch (error: any) {
    if (error instanceof LocationError) {
      throw error;
    }
    throw new LocationError(error.message || 'Failed to get current location');
  }
};

export const hasLocationPermission = async (): Promise<boolean> => {
  const permission = await Location.getForegroundPermissionsAsync();
  return permission.granted;
};
