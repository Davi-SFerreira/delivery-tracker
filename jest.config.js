export default {
  transform: {},
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/prisma/"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/frontend/" // Barreira absoluta para ignorar os testes do Playwright
  ]
};