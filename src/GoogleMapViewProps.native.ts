import type React from 'react';
import type { MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import type { MapViewBaseProps } from '@mapconductor/js-sdk-react/native';
import type { GoogleMapViewStateInterface } from '@mapconductor/react-for-googlemaps/state';

export interface GoogleMapViewProps extends MapViewBaseProps<GoogleMapViewStateInterface> {
  mapId?: string;
  className?: string;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  markerTilingOptions?: MarkerTilingOptions;
}
