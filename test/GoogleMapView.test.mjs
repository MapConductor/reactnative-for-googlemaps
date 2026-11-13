import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createGeoPoint, createMapCameraPosition } from '@mapconductor/js-sdk-core';
import { buildPackage } from './helpers/buildPackage.mjs';

// GoogleMapView は共有の NativeMapViewHost に「どのネイティブビューか」「デザインの id」
// 「apiKey」を渡すだけの層。React を描画せず関数として呼び、返ってきた要素の props で
// 受け渡しを確かめる。
const { mod, cleanup } = await buildPackage('mapview-tests');
after(cleanup);
const { GoogleMapView, GoogleMapDesign, GoogleMapViewState, GoogleMapViewController, NativeMapViewHost, ReactNativeBridgeMapViewController } = mod;

test('the shared native host is rendered with the GoogleMapView native view', () => {
  const element = GoogleMapView({ state: new GoogleMapViewState() });
  assert.equal(element.type, NativeMapViewHost);
  // Android の REACT_CLASS / iOS の RCT_EXPORT_MODULE と揃っていないと
  // 「View config not found」で落ちる名前。
  assert.deepEqual(element.props.nativeComponent, { nativeViewName: 'GoogleMapView' });
});

test('the design goes over as its id (the Google map type) and follows a design change', () => {
  const state = new GoogleMapViewState();
  assert.equal(GoogleMapView({ state }).props.mapDesignValue, 'roadmap');
  for (const [design, id] of [[GoogleMapDesign.Satellite, 'satellite'], [GoogleMapDesign.Hybrid, 'hybrid'], [GoogleMapDesign.Terrain, 'terrain'], [GoogleMapDesign.None, 'none']]) {
    state.mapDesignType = design;
    assert.equal(GoogleMapView({ state }).props.mapDesignValue, id);
  }
});

test('the API key from the state is handed to the native view', () => {
  assert.deepEqual(GoogleMapView({ state: new GoogleMapViewState({ apiKey: 'AIza-test' }) }).props.nativeProps, { apiKey: 'AIza-test' });
  assert.deepEqual(GoogleMapView({ state: new GoogleMapViewState() }).props.nativeProps, { apiKey: '' });
});

test('app props pass through to the host untouched', () => {
  const state = new GoogleMapViewState();
  const onMapClick = () => {};
  const props = GoogleMapView({ state, onMapClick, children: 'child' }).props;
  assert.equal(props.state, state);
  assert.equal(props.onMapClick, onMapClick);
  assert.equal(props.children, 'child');
});

test('createController builds a GoogleMapViewController bound to the native ref and initial camera', () => {
  const view = { nodeHandle: 7 };
  const camera = createMapCameraPosition({ position: createGeoPoint({ latitude: 35.68, longitude: 139.76 }), zoom: 12 });
  const controller = GoogleMapView({ state: new GoogleMapViewState() }).props.createController({ current: view }, camera);
  assert.ok(controller instanceof GoogleMapViewController);
  assert.ok(controller instanceof ReactNativeBridgeMapViewController);
  assert.equal(controller.getCameraPosition(), camera);
  assert.equal(controller.holder.mapView, view);
  controller.destroy();
});
