/* eslint-disable */
module.exports = {
  displayName: "server",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["../../node_modules/(?!axios)"],
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "coverage/packages/server",
  globalSetup: "../../node_modules/@databases/pg-test/jest/globalSetup",
  globalTeardown: "../../node_modules/@databases/pg-test/jest/globalTeardown",
};