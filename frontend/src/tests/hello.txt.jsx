// This is a simple test to make sure Jest and React Testing Library
// are working correctly on the frontend.

import React from 'react';
import { render, screen } from '@testing-library/react';

// A simple component to test
const Welcome = () => <div>Hello, Heeyah!</div>;

describe('Basic Frontend Test', () => {
    it('should render the Welcome component correctly', () => {
        // Arrange (Render the component)
        render(<Welcome />);

        // Act (Find the text)
        const textElement = screen.getByText(/Hello, Heeyah!/i);

        // Assert (Verify it exists)
        expect(textElement).toBeInTheDocument();
    });
});
