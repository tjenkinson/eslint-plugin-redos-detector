const path = require('path');

module.exports = {
  testEnvironment: 'node',
  rootDir: 'src',
  restoreMocks: true,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: path.resolve(__dirname, './tsconfig.test.json'),
      },
    ],
  },
};
