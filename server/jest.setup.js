// Jest setup file for server tests
// This file runs before each test file

// Set test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test helpers
global.testHelpers = {
  // Add any global test utilities here
  mockRequest: (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
  }),
  
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },
};