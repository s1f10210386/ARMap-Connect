import type { UserModel } from 'commonTypesWithClient/models';
import { atom } from 'jotai';
import type { GeolocationCoordinates } from 'src/utils/interface';

export const userAtom = atom<UserModel | null>(null);

export const coordinatesAtom = atom<GeolocationCoordinates>({
  latitude: null,
  longitude: null,
});
