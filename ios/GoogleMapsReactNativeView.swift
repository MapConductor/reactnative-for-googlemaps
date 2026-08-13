import MapConductorCore
@_spi(MapConductorDriver) import MapConductorForGoogleMaps
import MapConductorReactMarkerClustering
import MapConductorReactNativeCore
import UIKit

/// RN の Google Maps ビュー。共通の処理は ``MCReactNativeMapViewBase`` にあるので、
/// ここは Google Maps 固有のアダプタと、API キーの prop だけ。
@objc(MCGoogleMapsReactNativeView)
public final class GoogleMapsReactNativeView: MCReactNativeMapViewBase {
    private let googleHost = GoogleMapReactNativeHost()

    public override func makeHost() -> MCReactNativeMapHost { googleHost }

    public override init(frame: CGRect) {
        super.init(frame: frame)
        if let apiKey = Bundle.main.object(forInfoDictionaryKey: "GMSApiKey") as? String {
            googleHost.configure(apiKey: apiKey)
        }
    }

    public required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc public func setApiKey(_ value: String?) {
        guard let value else { return }
        googleHost.configure(apiKey: value)
        // キーが揃ったので次のレイアウトで地図を作らせる。
        setNeedsLayout()
    }
}

/// `GoogleMapHost`（ios-sdk）を RN の基底クラスが扱える非ジェネリックな形へ翻訳する。
@MainActor
final class GoogleMapReactNativeHost: MCReactNativeMapHost {
    weak var mcDelegate: MCReactNativeMapHostDelegate?

    private let state = GoogleMapViewState()
    private var isConfigured = false
    private lazy var mapHost: GoogleMapHost = {
        GoogleMapHost(
            state: state,
            handlers: MapViewHandlers(
                onMapLoaded: { [weak self] _ in self?.mcDelegate?.mcMapLoaded() },
                onMapClick: { [weak self] point in self?.mcDelegate?.mcMapClick(point) },
                onMapLongClick: { [weak self] point in self?.mcDelegate?.mcMapLongClick(point) },
                onCameraMoveStart: { [weak self] camera in self?.mcDelegate?.mcCameraMoveStart(camera) },
                onCameraMove: { [weak self] camera in self?.mcDelegate?.mcCameraMove(camera) },
                onCameraMoveEnd: { [weak self] camera in self?.mcDelegate?.mcCameraMoveEnd(camera) }
            )
        )
    }()

    var mcServiceRegistry: MutableMapServiceRegistry { state.serviceRegistry }
    var mcCameraZoom: Double { state.cameraPosition.zoom }

    /// キー未設定のまま `GMSMapView` を作ると落ちるので、揃うまで地図を作らせない。
    var mcIsReady: Bool { isConfigured }
    var mcNotReadyMessage: String? { "Google Maps API key is not configured. Set GMSApiKey in Info.plist." }

    func configure(apiKey value: String) {
        let apiKey = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !apiKey.isEmpty else { return }
        let selector = NSSelectorFromString("provideAPIKey:")
        _ = (NSClassFromString("GMSServices") as AnyObject?)?.perform(selector, with: apiKey)
        isConfigured = true
    }

    func mcMakeMapView(content: MapViewContent) -> UIView {
        mapHost.makeMapView(cameraRestriction: nil, content: content)
    }

    func mcUpdateContent(_ content: MapViewContent) {
        mapHost.updateContent(content)
        mapHost.updateInfoBubbleLayouts()
    }

    func mcSyncNativeViewSettings() {
        mapHost.syncNativeViewSettings()
    }

    func mcUnbind() {
        mapHost.unbind()
    }

    func mcSetMapDesign(id: String?) {
        switch id {
        case "satellite": state.mapDesignType = GoogleMapDesign.Satellite
        case "terrain": state.mapDesignType = GoogleMapDesign.Terrain
        case "hybrid": state.mapDesignType = GoogleMapDesign.Hybrid
        case "none": state.mapDesignType = GoogleMapDesign.None
        default: state.mapDesignType = GoogleMapDesign.Normal
        }
    }

    func mcMoveCamera(_ camera: MapCameraPosition, durationMillis: Int64?) {
        if let durationMillis {
            state.moveCameraTo(cameraPosition: camera, durationMillis: durationMillis)
        } else {
            state.moveCameraTo(cameraPosition: camera)
        }
    }

    func mcFitBounds(_ bounds: GeoRectBounds, padding: Int) {
        state.fitBounds(bounds: bounds, padding: padding)
    }

    func mcApplyUISettings(_ settings: MapUISettings) {
        state.uiSettings = settings
    }

    func mcToScreenOffset(_ position: GeoPointProtocol) -> CGPoint? {
        state.getMapViewHolder()?.toScreenOffset(position: position)
    }

    func mcMakeLocalExtensionRenderer(
        type: String,
        extensionId: String,
        eventSink: @escaping NativeMapExtensionEventSink
    ) -> NativeMapExtensionRenderer? {
        guard type == "marker-clustering" else { return nil }
        return MarkerClusterExtensionRenderer<GoogleMapActualMarker>(extensionId: extensionId, eventSink: eventSink)
    }
}
