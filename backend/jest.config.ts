import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};

export default config;
