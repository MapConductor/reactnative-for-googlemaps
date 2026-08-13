package com.mapconductor.react.googlemaps

import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.mapconductor.core.map.MapCameraPosition

/**
 * Google Maps SDK のカメラ型への変換。SDK 依存なのでここに残す。
 * ReadableMap <-> MapCameraPosition の変換は地図 SDK に依存しないため
 * `com.mapconductor.react.codec`（js-sdk-react）へ移動した。
 */
fun MapCameraPosition.toCameraPosition(): CameraPosition =
    CameraPosition.Builder()
        .target(LatLng(position.latitude, position.longitude))
        .zoom(zoom.toFloat())
        .bearing(bearing.toFloat())
        .tilt(tilt.toFloat())
        .build()
