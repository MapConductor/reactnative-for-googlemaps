export { GoogleMapDesign, GoogleMapDesignType, GoogleMapViewState, GoogleMapViewStateInterface, useGoogleMapViewState } from '@mapconductor/react-for-googlemaps/state';
import React from 'react';
import { ViewProps, HostComponent, NativeMethods } from 'react-native';
import { GeoPoint, MapCameraPosition, MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import { NativeMapExtensionEvent, MapViewBaseProps } from '@mapconductor/js-sdk-react/native';
import { ReactNativeMapViewHolder, ReactNativeBridgeMapViewController } from '@mapconductor/js-sdk-react/internal';
import { GoogleMapViewStateInterface } from '@mapconductor/react-for-googlemaps';

interface NativeGoogleMapViewEvent<T> {
    nativeEvent: T;
}
interface NativeMarkerTilingOptions {
    enabled: boolean;
    debugTileOverlay: boolean;
    minMarkerCount: number;
    cacheSize: number;
    /**
     * A JS function can't cross the RN bridge, so this only signals that
     * `iconScaleCallback` is set; the native wrapper resolves the actual
     * per-marker scale by calling back into JS via MarkerScaleBridge (JSI).
     */
    hasIconScaleCallback: boolean;
}
interface NativeGoogleMapViewProps extends ViewProps {
    apiKey?: string;
    cameraPosition?: {
        position: {
            latitude: number;
            longitude: number;
            altitude?: number | null;
        };
        zoom: number;
        bearing: number;
        tilt: number;
    };
    mapDesignType?: string;
    markerTilingOptions?: NativeMarkerTilingOptions;
    infoBubblePositions?: Array<{
        id: string;
        latitude: number;
        longitude: number;
        altitude?: number | null;
    }>;
    onMapLoaded?: () => void;
    onMarkerCompositionBatchProcessed?: (event: NativeGoogleMapViewEvent<{
        generation: number;
        sequence: number;
    }>) => void;
    onMapClick?: (event: NativeGoogleMapViewEvent<{
        point: GeoPoint;
    }>) => void;
    onMapLongClick?: (event: NativeGoogleMapViewEvent<{
        point: GeoPoint;
    }>) => void;
    onCameraMoveStart?: (event: NativeGoogleMapViewEvent<{
        cameraPosition: MapCameraPosition;
    }>) => void;
    onCameraMove?: (event: NativeGoogleMapViewEvent<{
        cameraPosition: MapCameraPosition;
    }>) => void;
    onCameraMoveEnd?: (event: NativeGoogleMapViewEvent<{
        cameraPosition: MapCameraPosition;
    }>) => void;
    onMarkerClick?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
    }>) => void;
    onCircleClick?: (event: NativeGoogleMapViewEvent<{
        circleId: string;
        point: GeoPoint;
    }>) => void;
    onGroundImageClick?: (event: NativeGoogleMapViewEvent<{
        groundImageId: string;
        point: GeoPoint;
    }>) => void;
    onPolylineClick?: (event: NativeGoogleMapViewEvent<{
        polylineId: string;
        point: GeoPoint;
    }>) => void;
    onPolygonClick?: (event: NativeGoogleMapViewEvent<{
        polygonId: string;
        point: GeoPoint;
    }>) => void;
    onMarkerDragStart?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
        point: GeoPoint;
    }>) => void;
    onMarkerDrag?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
        point: GeoPoint;
    }>) => void;
    onMarkerDragEnd?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
        point: GeoPoint;
    }>) => void;
    onMarkerAnimateStart?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
    }>) => void;
    onMarkerAnimateEnd?: (event: NativeGoogleMapViewEvent<{
        markerId: string;
    }>) => void;
    onMarkerScreenPositions?: (event: NativeGoogleMapViewEvent<{
        positions: Array<{
            markerId: string;
            x: number;
            y: number;
        }>;
    }>) => void;
    onInfoBubbleScreenPositions?: (event: NativeGoogleMapViewEvent<{
        positions: Array<{
            id: string;
            x: number;
            y: number;
        }>;
    }>) => void;
    onNativeMapExtensionEvent?: (event: NativeGoogleMapViewEvent<NativeMapExtensionEvent>) => void;
}
declare function toNativeMarkerTilingOptions(markerTilingOptions: MarkerTilingOptions | undefined): NativeMarkerTilingOptions | undefined;
declare function toNativeCameraPosition(cameraPosition: MapCameraPosition | undefined): {
    position: {
        latitude: number;
        longitude: number;
        altitude: number;
    };
    zoom: number;
    bearing: number;
    tilt: number;
} | undefined;

type GoogleMapViewRef = React.ComponentRef<HostComponent<NativeGoogleMapViewProps>> & NativeMethods;
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

interface GoogleMapViewProps extends Omit<MapViewBaseProps<GoogleMapViewStateInterface>, 'state'> {
    state?: GoogleMapViewStateInterface;
    mapId?: string;
    markerTilingOptions?: MarkerTilingOptions;
    className?: string;
    onError?: (error: Error) => void;
}
declare function GoogleMapView({ style, state, onMapLoaded, onMapClick, onMapLongClick, onCameraMoveStart, onCameraMove, onCameraMoveEnd, cameraRestriction, markerTilingOptions, children, }: GoogleMapViewProps): React.JSX.Element;

export { type GoogleMapMap, type GoogleMapMapView, GoogleMapMapViewHolder, GoogleMapView, GoogleMapViewController, type GoogleMapViewProps, type GoogleMapViewRef, type NativeGoogleMapViewEvent, type NativeGoogleMapViewProps, type NativeMarkerTilingOptions, toNativeCameraPosition, toNativeMarkerTilingOptions };
