const nextJest = require("next/jest")
const { pathsToModuleNameMapper } = require("ts-jest")
const { compilerOptions } = require("./tsconfig.json")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  moduleDirectories: ["node_modules", "src"],
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}

module.exports = createJestConfig(customJestConfig)
