// const {getDefaultConfig} = require('@react-native/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);

// defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
//   ext => ext !== 'svg',
// );
// defaultConfig.resolver.sourceExts = [
//   ...defaultConfig.resolver.sourceExts,
//   'svg',
// ];

// defaultConfig.transformer = {
//   ...defaultConfig.transformer,
//   babelTransformerPath: require.resolve('react-native-svg-transformer'),
// };

// module.exports = defaultConfig;


const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();