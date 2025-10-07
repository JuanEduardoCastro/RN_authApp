const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  setupFiles: [
    './node_modules/@react-native-google-signin/google-signin/jest/build/jest/setup.js',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  //
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-linear-gradient|@react-native-async-storage/async-storage|@react-native-google-signin/google-signin|@react-native-masked-view/masked-view|react-native-image-crop-picker|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-redux|@reduxjs/toolkit|react-native-countdown-timer-hooks|react-native-keyboard-controller)/)',
  ],
};
