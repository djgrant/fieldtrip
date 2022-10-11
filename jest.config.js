module.exports = {
  roots: ["<rootDir>apps/server/tests/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  globalSetup: "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup",
  globalTeardown:
    "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown",
};
