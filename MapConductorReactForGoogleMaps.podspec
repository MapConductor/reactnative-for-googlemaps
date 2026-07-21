require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name = "MapConductorReactForGoogleMaps"
  s.version = package["version"]
  s.summary = package["description"]
  s.license = package["license"]
  s.author = package["author"]
  s.homepage = "https://github.com/mapconductor/react-sdk"
  s.source = { :path => __dir__ }
  s.platforms = { :ios => "16.0" }
  s.source_files = "ios/*.{h,m,mm,swift}"
  # MapConductorForGoogleMaps is a source pod (see ios-sdk/ios-for-googlemaps's podspec) that
  # itself depends on the real, officially-published `GoogleMaps` pod - CocoaPods installs
  # Google's own binary directly into the consuming app, so neither this package nor
  # MapConductorForGoogleMaps ever vendors or redistributes it.
  s.dependency "React-Core"
  # Declared explicitly because this package's own Swift source imports MapConductorCore
  # directly, not just through MapConductorReactNativeCore/MapConductorForGoogleMaps.
  s.dependency "MapConductorCore"
  s.dependency "MapConductorReactNativeCore"
  s.dependency "MapConductorReactMarkerClustering"
  s.dependency "MapConductorForGoogleMaps"
end
