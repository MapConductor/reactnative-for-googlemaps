import { requireNativeComponent } from 'react-native';
import type {
  NativeMapViewEvent,
  NativeMapViewProps,
} from '@mapconductor/js-sdk-react/internal';

// 共通のブリッジ props / イベント型は js-sdk-react に集約してある。
export type NativeGoogleMapViewEvent<T> = NativeMapViewEvent<T>;

/** プロバイダ固有のネイティブ props。共通部は NativeMapViewProps 側にある。 */
export interface NativeGoogleMapViewProps extends NativeMapViewProps {
  apiKey?: string;
}

export {
  toNativeCameraPosition,
  toNativeMarkerTilingOptions,
  type NativeMarkerTilingOptions,
} from '@mapconductor/js-sdk-react/internal';

export default requireNativeComponent<NativeGoogleMapViewProps>(
  // Align to android/src/main/java/com/mapconductor/react/googlemaps/GoogleMapViewManager.kt (REACT_CLASS)
  // and ios/MapConductorGoogleMapViewManager.m (RCT_EXPORT_MODULE)
  'GoogleMapView'
);
