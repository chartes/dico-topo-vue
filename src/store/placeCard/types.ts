// types.ts
import { Place } from '@/store/places/types'

export interface PlaceOldLabel {
  id: string;
  label: string;
  date: string;
  reference: string;
  labelNode: string;
}

export interface PlaceCardState {
  placeItem?: Place;
  placeOldLabels: Array<PlaceOldLabel>;
  linkedPlaces: Array<Place>;

  error?: string;
  isLoading: boolean;
}
