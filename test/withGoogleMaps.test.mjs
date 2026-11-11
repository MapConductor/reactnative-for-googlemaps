import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { after, afterEach, beforeEach, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'tsup';

// Expo の config plugin（plugin/src/withGoogleMaps.ts）が app/build.gradle をどう書き換えるか。
// minSdkVersion の行を上書きすること、API キーを manifestPlaceholders に 1 回だけ差し込むこと、
// キーの既定値が EXPO_PUBLIC_GOOGLE_MAPS_API_KEY であることを、gradle の文字列だけで確かめる。
mkdirSync(new URL('../build/', import.meta.url), { recursive: true });
const outDir = mkdtempSync(fileURLToPath(new URL('../build/plugin-tests-', import.meta.url)));
after(() => rmSync(outDir, { recursive: true, force: true }));
await build({
  entry: { plugin: 'plugin/src/withGoogleMaps.ts' },
  outDir, format: ['esm'], platform: 'node', splitting: false,
  dts: false, sourcemap: false, config: false, silent: true,
});
const { default: withGoogleMaps } = await import(pathToFileURL(resolve(outDir, 'plugin.mjs')));

const TEMPLATE = `android {
    namespace "com.example"
    defaultConfig {
        applicationId "com.example"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
    }
}
`;

// プラグインが積んだ appBuildGradle の mod を、Expo の prebuild の代わりに直接呼ぶ。
async function applyPlugin(props, contents = TEMPLATE) {
  const config = withGoogleMaps({ name: 'app', slug: 'app' }, props);
  const mod = config.mods?.android?.appBuildGradle;
  assert.equal(typeof mod, 'function', 'the plugin registers an android appBuildGradle mod');
  const result = await mod({
    ...config,
    modResults: { contents, language: 'groovy', path: 'android/app/build.gradle' },
    modRequest: { platform: 'android', modName: 'appBuildGradle', projectRoot: '/tmp/app', platformProjectRoot: '/tmp/app/android', introspect: false },
    modRawConfig: config,
  });
  return result.modResults.contents;
}

let savedEnv;
let warnings;
let savedWarn;
beforeEach(() => {
  savedEnv = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  delete process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  warnings = [];
  savedWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
});
afterEach(() => {
  if (savedEnv === undefined) delete process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  else process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = savedEnv;
  console.warn = savedWarn;
});

test('the template minSdkVersion line is overridden with 26 by default', async () => {
  const out = await applyPlugin({ googleMapsApiKey: 'k' });
  assert.match(out, /minSdkVersion 26\n/);
  assert.doesNotMatch(out, /minSdkVersion rootProject\.ext\.minSdkVersion/);
  // ほかの行は触らない。
  assert.match(out, /targetSdkVersion rootProject\.ext\.targetSdkVersion/);
});

test('a requested minSdkVersion is used instead', async () => {
  const out = await applyPlugin({ googleMapsApiKey: 'k', minSdkVersion: 28 });
  assert.match(out, /minSdkVersion 28\n/);
});

test('the API key is placed inside defaultConfig as a quoted manifest placeholder', async () => {
  const out = await applyPlugin({ googleMapsApiKey: 'AIza"x' });
  const line = '        manifestPlaceholders["googleMapsApiKey"] = "AIza\\"x"';
  assert.ok(out.includes(line), out);
  assert.ok(out.indexOf(line) > out.indexOf('defaultConfig {'));
  assert.ok(out.indexOf(line) < out.indexOf('applicationId'), 'right after the defaultConfig anchor');
  assert.deepEqual(warnings, []);
});

test('the key defaults to EXPO_PUBLIC_GOOGLE_MAPS_API_KEY', async () => {
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = 'from-env';
  const out = await applyPlugin(undefined);
  assert.ok(out.includes('manifestPlaceholders["googleMapsApiKey"] = "from-env"'));
  // 明示した値が環境変数より優先される。
  const explicit = await applyPlugin({ googleMapsApiKey: 'explicit' });
  assert.ok(explicit.includes('= "explicit"'));
  assert.ok(!explicit.includes('from-env'));
});

test('re-running prebuild on an already patched file does not duplicate the placeholder', async () => {
  const once = await applyPlugin({ googleMapsApiKey: 'k1' });
  const twice = await applyPlugin({ googleMapsApiKey: 'k2' }, once);
  assert.equal(twice.match(/manifestPlaceholders\["googleMapsApiKey"\]/g).length, 1);
  assert.ok(twice.includes('= "k2"'), 'the generated block is replaced with the new key');
});

test('a missing key and an unexpected minSdk line only warn; the placeholder is still written', async () => {
  const custom = TEMPLATE.replace('minSdkVersion rootProject.ext.minSdkVersion', 'minSdkVersion 24');
  const out = await applyPlugin({}, custom);
  assert.match(out, /minSdkVersion 24\n/, 'an unrecognised minSdk line is left alone');
  assert.ok(out.includes('manifestPlaceholders["googleMapsApiKey"] = ""'));
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /No Google Maps API key found/);
  assert.match(warnings[1], /Could not find the expected/);
});
