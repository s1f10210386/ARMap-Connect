import { atom } from 'jotai';
import type { GeolocationCoordinates } from 'src/utils/coordinates';

export const userAtom = atom<null>(null);

export const coordinatesAtom = atom<GeolocationCoordinates>({
  latitude: null,
  longitude: null,
});

export const isMapViewAtomAtom = atom(true);
