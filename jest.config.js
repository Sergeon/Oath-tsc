module.exports = {
  'collectCoverage': true,
  'collectCoverageFrom': [
    '!**/*.d.ts',
    '**/src/oath.ts',
    '!**/node_modules/**',
    '!**/e2e/**'
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 50,
      "lines": 50,
      "statements": 50
    }
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'vue'
  ],
  testMatch: ['**/?(*.)(spec|test).(ts|js)?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  verbose: true,
}