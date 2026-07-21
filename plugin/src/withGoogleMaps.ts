import { type ConfigPlugin, createRunOncePlugin, withAppBuildGradle } from '@expo/config-plugins';
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';

const pkg = require('../../package.json') as { name: string; version: string };

/**
 * com.mapconductor:for-googlemaps's own AndroidManifest.xml declares
 * `<uses-sdk android:minSdkVersion="26" />` and a `com.google.android.geo.API_KEY` meta-data
 * value of `${googleMapsApiKey}` - a blank Expo app never satisfies either on its own. This
 * plugin fills in both by editing the app's own `android/app/build.gradle` at `expo prebuild`
 * time, the same way `react-native-maps`'s config plugin does.
 */
export interface GoogleMapsPluginProps {
  /**
   * Defaults to `process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (loaded from `.env`/`.env.local`
   * by Expo CLI) so a single env var covers both this Android manifest placeholder and the
   * `apiKey` prop passed to `useGoogleMapViewState` on the JS side for iOS - no separate
   * Android-only config file needed.
   */
  googleMapsApiKey?: string;
  /** com.mapconductor:for-googlemaps's own required floor; only raise it here, never lower it. */
  minSdkVersion?: number;
}

const withGoogleMapsApiKey: ConfigPlugin<GoogleMapsPluginProps | void> = (config, props) => {
  const apiKey = props?.googleMapsApiKey ?? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const minSdkVersion = props?.minSdkVersion ?? 26;

  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      '[@mapconductor/reactnative-for-googlemaps] No Google Maps API key found. Set ' +
        'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local, or pass `googleMapsApiKey` to this ' +
        'plugin - the native Google Maps view will mount but show no tiles without one.'
    );
  }

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // A straight regex replace (not mergeContents' anchor-append) because this must *override*
    // the template's own `minSdkVersion rootProject.ext.minSdkVersion` line - appending a second
    // assignment earlier in the same defaultConfig block would just get overwritten by the
    // original line executing after it (Gradle/Groovy: last assignment in file order wins).
    const minSdkPattern = /minSdkVersion\s+rootProject\.ext\.minSdkVersion/;
    if (minSdkPattern.test(contents)) {
      contents = contents.replace(minSdkPattern, `minSdkVersion ${minSdkVersion}`);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        '[@mapconductor/reactnative-for-googlemaps] Could not find the expected ' +
          '`minSdkVersion rootProject.ext.minSdkVersion` line in app/build.gradle to raise to ' +
          `${minSdkVersion} - set it manually (e.g. via expo-build-properties) if the build ` +
          'fails with a minSdk manifest merge error.'
      );
    }

    // manifestPlaceholders["googleMapsApiKey"] has no existing assignment to override, so a
    // plain mergeContents append (anchored right inside defaultConfig) is safe here.
    contents = mergeContents({
      tag: 'mapconductor-google-maps-api-key',
      src: contents,
      newSrc: `        manifestPlaceholders["googleMapsApiKey"] = ${JSON.stringify(apiKey)}`,
      anchor: /defaultConfig\s*{/,
      offset: 1,
      comment: '//',
    }).contents;

    config.modResults.contents = contents;
    return config;
  });
};

export default createRunOncePlugin(withGoogleMapsApiKey, pkg.name, pkg.version);
