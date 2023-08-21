const nextJest = require("next/jest")
const { compilerOptions } = require("./tsconfig.json")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  moduleDirectories: ["node_modules", "src", "<rootDir>"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}

module.exports = createJestConfig(customJestConfig)
