import { GoogleMapViewStateInterface } from '@mapconductor/react-for-googlemaps/state';
export { GoogleMapDesign, GoogleMapDesignType, GoogleMapViewState, GoogleMapViewStateInterface, useGoogleMapViewState } from '@mapconductor/react-for-googlemaps/state';
import * as React from 'react';
import React__default from 'react';
import { HostComponent, NativeMethods } from 'react-native';
import { NativeMapViewProps, NativeMapViewEvent, ReactNativeMapViewHolder, ReactNativeBridgeMapViewController } from '@mapconductor/js-sdk-react/internal';
export { NativeMarkerTilingOptions, toNativeCameraPosition, toNativeMarkerTilingOptions } from '@mapconductor/js-sdk-react/internal';
import { MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import { MapViewBaseProps } from '@mapconductor/js-sdk-react/native';

type NativeGoogleMapViewEvent<T> = NativeMapViewEvent<T>;
/** プロバイダ固有のネイティブ props。共通部は NativeMapViewProps 側にある。 */
interface NativeGoogleMapViewProps extends NativeMapViewProps {
    apiKey?: string;
}

type GoogleMapViewRef = React__default.ComponentRef<HostComponent<NativeGoogleMapViewProps>> & NativeMethods;
type GoogleMapMapView = GoogleMapViewRef | null;
type GoogleMapMap = null;

/**
 * RN のホルダーは全プロバイダで同一（投影はネイティブ側が行う）なので
 * {@link ReactNativeMapViewHolder} に集約してある。ここは ref 型を与えるだけ。
 */
declare class GoogleMapMapViewHolder extends ReactNativeMapViewHolder<GoogleMapViewRef> {
}

/**
 * ネイティブブリッジの実装は全 RN プロバイダで同一なので
 * {@link ReactNativeBridgeMapViewController} に集約してある。ここはネイティブビューの
 * ref 型を与えるだけ。プロバイダ固有の振る舞いが要るときだけメソッドを override する。
 */
declare class GoogleMapViewController extends ReactNativeBridgeMapViewController<GoogleMapViewRef> {
}

interface GoogleMapViewProps extends MapViewBaseProps<GoogleMapViewStateInterface> {
    mapId?: string;
    className?: string;
    onError?: (error: Error) => void;
    children?: React__default.ReactNode;
    markerTilingOptions?: MarkerTilingOptions;
}

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
declare function GoogleMapView(props: GoogleMapViewProps): React.JSX.Element;

export { type GoogleMapMap, type GoogleMapMapView, GoogleMapMapViewHolder, GoogleMapView, GoogleMapViewController, type GoogleMapViewProps, type GoogleMapViewRef, type NativeGoogleMapViewEvent, type NativeGoogleMapViewProps };
