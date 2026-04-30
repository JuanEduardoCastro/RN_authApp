module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js project
          ['^node:'],
          [
            '^(assert|buffer|child_process|cluster|crypto|dns|events|fs|http|https|net|os|path|process|querystring|readline|stream|timers|tls|url|util|v8|vm|worker_threads|zlib)(/|$)',
          ],
          // React.js React-Native project
          ['^react$'],
          ['^react-native$'],
          ['^react-', '^@react-', '^@react-native-', '^@invertase'],
          // Node.js, React.js & React-Native project
          [
            '^(?!@(screens|components|hooks|navigation|store|context|constants|utils|assets|locale|env)(/|$))@?\\w',
          ],
          // React.js React-Native project
          ['^@store', '^@env'],
          ['^@navigation', '^@screens'],
          ['^@components'],
          ['^@hooks', '^@context'],
          ['^@constants'],
          ['^@utils'],
          ['^@assets', '^@locale'],
          // Node.js project
          [
            '^@(controllers|services|models|middleware|routes|config|utils|types|constants)(/|$)',
          ],
          ['^\\.', '^src/'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};
