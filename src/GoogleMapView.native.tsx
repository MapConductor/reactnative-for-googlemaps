import { NativeMapViewHost } from '@mapconductor/js-sdk-react/internal';
import type { GoogleMapViewStateInterface } from '@mapconductor/react-for-googlemaps/state';
import { GoogleMapViewController } from './GoogleMapViewController.native';
import type { GoogleMapViewProps } from './GoogleMapViewProps.native';
import type { GoogleMapViewRef } from './GoogleMapTypeAlias.native';
import NativeGoogleMapView from './GoogleMapViewNativeComponent';

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
export function GoogleMapView(props: GoogleMapViewProps) {
  return (
    <NativeMapViewHost<GoogleMapViewRef, GoogleMapViewStateInterface>
      {...props}
      nativeComponent={NativeGoogleMapView}
      mapDesignValue={props.state.mapDesignType.id}
      nativeProps={{ apiKey: props.state.apiKey }}
      createController={(ref, camera) => new GoogleMapViewController(ref, camera)}
    />
  );
}
