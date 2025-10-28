// Sample test file to verify Jest setup
describe('Jest Setup Test', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have access to test helpers', () => {
    const req = global.testHelpers.mockRequest({ test: 'data' });
    const res = global.testHelpers.mockResponse();
    
    expect(req.body.test).toBe('data');
    expect(typeof res.status).toBe('function');
    expect(typeof res.json).toBe('function');
  });

  test('should handle async operations', async () => {
    const asyncFunction = () => Promise.resolve('success');
    const result = await asyncFunction();
    expect(result).toBe('success');
  });
});