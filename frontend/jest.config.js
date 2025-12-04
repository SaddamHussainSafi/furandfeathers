export default {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|svg|mp4)$": "<rootDir>/src/test/__mocks__/fileMock.js",
  },
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
