// Sample test file to verify Jest setup for React components
import { render, screen } from '@testing-library/react';

// Simple test component
const TestComponent = ({ message = 'Hello World' }) => {
  return <div data-testid="test-message">{message}</div>;
};

describe('Jest Setup Test for Frontend', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should render React component', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test-message')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('should render component with custom props', () => {
    render(<TestComponent message="Custom Message" />);
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });

  test('should have access to test helpers', () => {
    const mockUser = global.testHelpers.mockUser({ name: 'John Doe' });
    const mockAuth = global.testHelpers.mockAuthContext({ user: mockUser });
    
    expect(mockUser.name).toBe('John Doe');
    expect(mockAuth.user.name).toBe('John Doe');
    expect(typeof mockAuth.login).toBe('function');
  });

  test('should handle async operations', async () => {
    const asyncFunction = () => Promise.resolve('success');
    const result = await asyncFunction();
    expect(result).toBe('success');
  });

  test('should mock localStorage', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test', 'value');
  });
});