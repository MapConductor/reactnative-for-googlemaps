package com.mapconductor.react.googlemaps

import android.content.Context
import android.view.View
import androidx.compose.ui.geometry.Offset
import com.google.android.gms.maps.GoogleMapOptions
import com.google.android.gms.maps.MapView
import com.mapconductor.core.features.GeoPointInterface
import com.mapconductor.core.map.MapCameraPosition
import com.mapconductor.core.map.MutableMapServiceRegistry
import com.mapconductor.core.marker.MarkerTilingOptions
import com.mapconductor.googlemaps.GoogleMapDesignType
import com.mapconductor.googlemaps.GoogleMapViewController
import com.mapconductor.googlemaps.GoogleMapViewHolder
import com.mapconductor.googlemaps.GoogleMapViewScope
import com.mapconductor.googlemaps.createGoogleMapViewController
import com.mapconductor.react.wrapper.MapConductorMapViewWrapperBase
import com.mapconductor.react.wrapper.MapConductorReactNativeHost
import com.mapconductor.react.wrapper.MapConductorReactNativeHostDelegate
import com.mapconductor.googlemaps.GoogleMapDesign as ComposeGoogleMapDesign

/**
 * RN の Google Maps ビュー。
 *
 * コマンドの受け口・マーカー取り込み・スクリーン座標の通知・拡張の Compose レイヤは
 * [MapConductorMapViewWrapperBase]（js-sdk-react/android）が全部持っているので、
 * ここはプロバイダ固有のアダプタを差すだけ。
 */
class GoogleMapViewWrapper(context: Context) : MapConductorMapViewWrapperBase(context) {
    override val host: MapConductorReactNativeHost = GoogleMapsReactNativeHost()
}

/** Google Maps の地図一式を RN のラッパー基底が扱える形へ翻訳する。 */
private class GoogleMapsReactNativeHost : MapConductorReactNativeHost {
    override val providerName = "GoogleMaps"
    override val extensionScope = GoogleMapViewScope()
    override val serviceRegistry = MutableMapServiceRegistry()

    private var mapView: MapView? = null
    private var holder: GoogleMapViewHolder? = null
    private var controller: GoogleMapViewController? = null
    private var mapDesign: GoogleMapDesignType = ComposeGoogleMapDesign.Normal

    override fun createMapView(
        context: Context,
        initialCamera: MapCameraPosition,
        markerTiling: MarkerTilingOptions,
        delegate: MapConductorReactNativeHostDelegate,
    ): View {
        val nativeMapView =
            MapView(
                context,
                GoogleMapOptions()
                    .mapType(mapDesign.getValue())
                    .camera(initialCamera.toCameraPosition()),
            ).apply {
                onCreate(null)
                onResume()
            }
        mapView = nativeMapView

        nativeMapView.getMapAsync { map ->
            if (!delegate.isAttached) return@getMapAsync
            val mapHolder = GoogleMapViewHolder(nativeMapView, map)
            holder = mapHolder
            val viewController =
                createGoogleMapViewController(
                    holder = mapHolder,
                    markerTiling = markerTiling,
                    serviceRegistry = serviceRegistry,
                )
            controller = viewController
            delegate.onControllerReady(viewController)
            // 初期化リスナーと状態フラグの両方から来るが、基底が 1 回に畳む。
            viewController.setMapInitializedListener { delegate.onMapLoaded() }
            if (viewController.mapLoadedState.value) delegate.onMapLoaded()
            nativeMapView.post { viewController.sendInitialCameraUpdate() }
        }
        return nativeMapView
    }

    override fun setMapDesign(id: String?) {
        mapDesign = ComposeGoogleMapDesign.toMapDesignType(GoogleMapDesign.from(id))
        controller?.setMapDesignType(mapDesign)
    }

    override fun toScreenOffset(position: GeoPointInterface): Offset? = holder?.toScreenOffset(position)

    override fun destroy() {
        controller?.destroy()
        controller = null
        holder = null
        mapView?.onPause()
        mapView?.onDestroy()
        mapView = null
    }
}
