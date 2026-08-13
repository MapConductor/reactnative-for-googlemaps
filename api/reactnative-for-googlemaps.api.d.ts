export { GoogleMapDesign, GoogleMapDesignType, GoogleMapViewState, GoogleMapViewStateInterface, useGoogleMapViewState } from '@mapconductor/react-for-googlemaps/state';
import React from 'react';
import { ViewProps, HostComponent, NativeMethods } from 'react-native';
import { GeoPoint, MapCameraPosition, MarkerTilingOptions, MapViewHolderBase, Offset, BaseMapViewController, MapViewControllerInterface, CircleCapable, GroundImageCapable, MarkerCapable, PolygonCapable, PolylineCapable, RasterLayerCapable, NativeMapExtensionCapable, GeoRectBounds, MapUISettings, MarkerState, PolylineState, CircleState, OnCircleEventHandler, GroundImageState, OnGroundImageEventHandler, PolygonState, OnPolygonEventHandler, OnPolylineEventHandler, RasterLayerState, NativeMapExtensionDescriptor, NativeMapExtensionEventHandler, NativeMapExtensionEvent as NativeMapExtensionEvent$1, OnMarkerEventHandler, MarkerAnimationOverlayHost } from '@mapconductor/js-sdk-core';
import { NativeMapExtensionEvent, MapViewBaseProps } from '@mapconductor/js-sdk-react/native';
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

declare class GoogleMapMapViewHolder extends MapViewHolderBase<GoogleMapViewRef | null, null> {
    private readonly nativeRef;
    readonly map: null;
    constructor(nativeRef: React.RefObject<GoogleMapViewRef | null>);
    get mapView(): GoogleMapViewRef | null;
    toScreenOffset(_position: GeoPoint): null;
    fromScreenOffsetSync(_offset: Offset): GeoPoint | null;
}

declare class GoogleMapViewController extends BaseMapViewController implements MapViewControllerInterface, CircleCapable, GroundImageCapable, MarkerCapable, PolygonCapable, PolylineCapable, RasterLayerCapable, NativeMapExtensionCapable {
    private readonly nativeRef;
    readonly holder: GoogleMapMapViewHolder;
    private cameraPosition;
    private mapLoaded;
    private markerCompositionGeneration;
    private activeMarkerComposition;
    private pendingMarkerComposition;
    private markerBatchAck;
    private readonly pendingMarkerUpdates;
    private readonly markerStates;
    private readonly circleStates;
    private readonly groundImageStates;
    private readonly polygonStates;
    private readonly polylineStates;
    private readonly rasterLayerStates;
    private pendingPolygons;
    private pendingCircles;
    private pendingGroundImages;
    private pendingPolylines;
    private pendingRasterLayers;
    private markerClickListener;
    private circleClickListener;
    private groundImageClickListener;
    private markerDragStartListener;
    private markerDragListener;
    private markerDragEndListener;
    private markerAnimateStartListener;
    private markerAnimateEndListener;
    private polygonClickListener;
    private polylineClickListener;
    private readonly nativeMapExtensionEventHandlers;
    constructor(nativeRef: React.RefObject<GoogleMapViewRef | null>, cameraPosition: MapCameraPosition);
    clearOverlays(): Promise<void>;
    moveCamera(position: MapCameraPosition): Promise<boolean>;
    animateCamera(position: MapCameraPosition, durationMillis: number): Promise<boolean>;
    fitBounds(bounds: GeoRectBounds, padding: number): Promise<boolean>;
    getCameraPosition(): MapCameraPosition | null;
    /**
     * ジェスチャ設定をネイティブへ転送する。web 版が地図エンジンへ直接適用するのに対し、
     * RN はネイティブのコントローラが `applyUISettings` を持つのでブリッジ 1 本で済む。
     */
    applyUISettings(settings: MapUISettings): void;
    compositionMarkers(data: MarkerState[]): Promise<void>;
    updateMarker(state: MarkerState): Promise<void>;
    compositionPolylines(data: PolylineState[]): Promise<void>;
    compositionCircles(data: CircleState[]): Promise<void>;
    updateCircle(state: CircleState): Promise<void>;
    hasCircle(state: CircleState): boolean;
    setOnCircleClickListener(listener: OnCircleEventHandler | null): void;
    compositionGroundImages(data: GroundImageState[]): Promise<void>;
    updateGroundImage(state: GroundImageState): Promise<void>;
    hasGroundImage(state: GroundImageState): boolean;
    setOnGroundImageClickListener(listener: OnGroundImageEventHandler | null): void;
    compositionPolygons(data: PolygonState[]): Promise<void>;
    updatePolygon(state: PolygonState): Promise<void>;
    hasPolygon(state: PolygonState): boolean;
    setOnPolygonClickListener(listener: OnPolygonEventHandler | null): void;
    updatePolyline(state: PolylineState): Promise<void>;
    hasPolyline(state: PolylineState): boolean;
    setOnPolylineClickListener(listener: OnPolylineEventHandler | null): void;
    compositionRasterLayers(data: RasterLayerState[]): Promise<void>;
    updateRasterLayer(state: RasterLayerState): Promise<void>;
    hasRasterLayer(state: RasterLayerState): boolean;
    upsertNativeMapExtension(extension: NativeMapExtensionDescriptor, eventHandler?: NativeMapExtensionEventHandler | null): void;
    removeNativeMapExtension(extensionId: string): void;
    onNativeMapExtensionEvent(event: NativeMapExtensionEvent$1): void;
    hasMarker(state: MarkerState): boolean;
    setOnMarkerClickListener(listener: OnMarkerEventHandler | null): void;
    setOnMarkerDragStart(listener: OnMarkerEventHandler | null): void;
    setOnMarkerDrag(listener: OnMarkerEventHandler | null): void;
    setOnMarkerDragEnd(listener: OnMarkerEventHandler | null): void;
    setOnMarkerAnimateStart(listener: OnMarkerEventHandler | null): void;
    setOnMarkerAnimateEnd(listener: OnMarkerEventHandler | null): void;
    setMarkerAnimationOverlayHost(_host: MarkerAnimationOverlayHost | null): void;
    setMapInitializedListener(listener: (() => void) | null): void;
    destroy(): void;
    onNativeCameraMoveStart(camera: MapCameraPosition): void;
    onNativeCameraMove(camera: MapCameraPosition): void;
    onNativeCameraMoveEnd(camera: MapCameraPosition): void;
    onNativeMapLoaded(): void;
    onNativeMarkerCompositionBatchProcessed(generation: number, sequence: number): void;
    onNativeMapClick(point: GeoPoint): void;
    onNativeMapLongClick(point: GeoPoint): void;
    onNativeMarkerClick(markerId: string): void;
    onNativeCircleClick(circleId: string, clicked: GeoPoint): void;
    onNativeGroundImageClick(groundImageId: string, clicked: GeoPoint): void;
    onNativePolylineClick(polylineId: string, clicked: GeoPoint): void;
    onNativePolygonClick(polygonId: string, clicked: GeoPoint): void;
    onNativeMarkerDragStart(markerId: string, point: GeoPoint): void;
    onNativeMarkerDrag(markerId: string, point: GeoPoint): void;
    onNativeMarkerDragEnd(markerId: string, point: GeoPoint): void;
    onNativeMarkerAnimateStart(markerId: string): void;
    onNativeMarkerAnimateEnd(markerId: string): void;
    private dispatchCommand;
    private flushPendingMarkerUpdates;
    private startPendingMarkerComposition;
    private waitForMarkerBatchAck;
    private cancelMarkerBatchAck;
    private cancelMarkerComposition;
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
