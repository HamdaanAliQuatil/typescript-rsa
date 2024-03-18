const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 0,
    }
  },
  rootDir: '.',
  moduleNameMapper: {
    '^@boost/(.*)$': '<rootDir>/src/$1'
  },
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
}