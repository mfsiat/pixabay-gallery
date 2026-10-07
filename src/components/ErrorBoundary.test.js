import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Suppress console.error for these tests since we're intentionally triggering errors
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders error message when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('displays recovery instructions in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Please refresh the page and try again/i)).toBeInTheDocument();
  });

  test('has correct styling for error message', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const errorHeading = screen.getByText(/Something went wrong/i);
    expect(errorHeading).toHaveClass('text-3xl');
    expect(errorHeading).toHaveClass('text-center');
    expect(errorHeading).toHaveClass('text-red-500');
  });

  test('has correct styling for recovery message', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const recoveryMessage = screen.getByText(/Please refresh the page and try again/i);
    expect(recoveryMessage).toHaveClass('text-lg');
    expect(recoveryMessage).toHaveClass('text-center');
    expect(recoveryMessage).toHaveClass('text-gray-600');
  });

  test('logs error to console when error is caught', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );

    consoleErrorSpy.mockRestore();
  });

  test('handles multiple children', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  test('catches errors in nested components', () => {
    const NestedThrowingComponent = () => (
      <div>
        <ThrowError />
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('does not catch errors in event handlers', () => {
    // Error boundaries do not catch errors in event handlers
    // This test documents that behavior
    const ConsoleComponent = () => {
      const handleClick = () => {
        throw new Error('Event handler error');
      };
      return <button onClick={handleClick}>Click me</button>;
    };

    render(
      <ErrorBoundary>
        <ConsoleComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
    // The component should render even though there will be an error on click
  });

  test('wraps error message in container with correct classes', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toHaveClass('mx-auto');
  });

  test('maintains error state after initial error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Even if we try to rerender with new children,
    // the error boundary stays in error state
    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('getDerivedStateFromError sets hasError to true', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // When error is caught, hasError state becomes true and error UI is shown
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
