const nextJest = require("next/jest")
const { compilerOptions } = require("./tsconfig.json")

const createJestConfig = nextJest({
  dir: "./",
})

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ["node_modules", "src", "<rootDir>"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(nanoid)/)"],
}

module.exports = createJestConfig(customJestConfig)
