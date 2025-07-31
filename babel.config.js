/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.jsx',
          '.android.jsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
        ],
        root: ['.'],
        alias: {
          // '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@context': './src/context',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@navigatiors': './src/navigatiors',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        env: {
          development: {
            moduleName: '@env',
            path: '.env.development',
          },
          production: {
            moduleName: '@env',
            path: '.env.production',
          },
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
