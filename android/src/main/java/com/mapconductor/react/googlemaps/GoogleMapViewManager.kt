package com.mapconductor.react.googlemaps

import com.mapconductor.react.wrapper.MapConductorMapViewCommands
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

class GoogleMapViewManager : ViewGroupManager<GoogleMapViewWrapper>() {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): GoogleMapViewWrapper {
        return GoogleMapViewWrapper(reactContext)
    }

    override fun onAfterUpdateTransaction(view: GoogleMapViewWrapper) {
        super.onAfterUpdateTransaction(view)
        view.initializeMapIfNeeded()
    }

    @ReactProp(name = "cameraPosition")
    fun setCameraPosition(
        view: GoogleMapViewWrapper,
        cameraPosition: ReadableMap?,
    ) {
        view.setCameraPosition(cameraPosition)
    }

    @ReactProp(name = "mapDesignType")
    fun setMapDesignType(
        view: GoogleMapViewWrapper,
        mapDesignType: String?,
    ) {
        view.setMapDesignType(mapDesignType)
    }

    @ReactProp(name = "infoBubblePositions")
    fun setInfoBubblePositions(
        view: GoogleMapViewWrapper,
        positions: ReadableArray?,
    ) {
        view.setInfoBubblePositions(positions)
    }

    @ReactProp(name = "markerTilingOptions")
    fun setMarkerTilingOptions(
        view: GoogleMapViewWrapper,
        options: ReadableMap?,
    ) {
        view.setMarkerTilingOptions(options)
    }

    override fun receiveCommand(
        root: GoogleMapViewWrapper,
        commandId: String,
        args: ReadableArray?,
    ) {
        // コマンド名の対応は全プロバイダ共通。写経すると綴り違いが黙って無効化されるため
        // js-sdk-react に集約してある。
        MapConductorMapViewCommands.receive(root, commandId, args)
    }

    override fun onDropViewInstance(view: GoogleMapViewWrapper) {
        view.onDropViewInstance()
        super.onDropViewInstance(view)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        MapConductorMapViewCommands.directEventTypeConstants()

    companion object {
        const val REACT_CLASS = "GoogleMapView"
    }
}
