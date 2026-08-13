import type React from 'react';
import { MapViewHolderBase } from '@mapconductor/js-sdk-core';
import type { GeoPoint, Offset } from '@mapconductor/js-sdk-core';
import type { GoogleMapViewRef } from './GoogleMapTypeAlias.native';

export class GoogleMapMapViewHolder
  extends MapViewHolderBase<GoogleMapViewRef | null, null>
{
  readonly map = null;

  constructor(private readonly nativeRef: React.RefObject<GoogleMapViewRef | null>) {
    super();
  }

  get mapView(): GoogleMapViewRef | null {
    return this.nativeRef.current;
  }

  toScreenOffset(_position: GeoPoint): null {
    return null;
  }

  fromScreenOffsetSync(_offset: Offset): GeoPoint | null {
    return null;
  }
}
