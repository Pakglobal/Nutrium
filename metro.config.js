const {getDefaultConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  ext => ext !== 'svg',
);
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'svg',
];

defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = defaultConfig;

// const { getDefaultConfig } = require('metro-config');
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
// const { mergeConfig } = require('metro-config'); // You may need to import mergeConfig if it's not already available

// const config = {};
// const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// module.exports = wrapWithReanimatedMetroConfig(mergedConfig);

// // Additional transformer settings
// module.exports.transformer = {
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: false,
//       inlineRequires: true,
//     },
//   }),
// };

// const { getDefaultConfig } = require('metro-config');
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
// const { mergeConfig } = require('metro-config');
// const path = require('path');  // Import path module to resolve file paths

// const config = {};
// const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// module.exports = wrapWithReanimatedMetroConfig(mergedConfig);

// // Add SVG transformer configuration
// module.exports.transformer = {
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: false,
//       inlineRequires: true,
//     },
//   }),
//   babelTransformerPath: require.resolve('react-native-svg-transformer'), // Use the SVG transformer
// };

// module.exports.resolver = {
//   // Add .svg to the list of file extensions that the resolver can process
//   resolveRequest: (context, realModuleName, platform) => {
//     if (realModuleName.endsWith('.svg')) {
//       return { filePath: realModuleName };
//     }
//     return context.resolveRequest(context, realModuleName, platform);
//   },
//   // Add SVG extensions
//   sourceExts: ['jsx', 'js', 'ts', 'tsx', 'svg'],
// };
