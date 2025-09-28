export default {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true, tsconfig: "tsconfig.json" }],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    // Corrige imports .js gerados pelo TS em runtime de testes
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/integration/**/*.test.ts"],
  setupFiles: ["dotenv/config"],
  verbose: true,
};
