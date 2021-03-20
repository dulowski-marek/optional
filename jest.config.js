module.exports = {
    preset: 'ts-jest',
    testRegex: 'src/.*test.ts',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['<rootDir>/build/'],
};
