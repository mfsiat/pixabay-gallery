import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto">
          <h1 className="text-3xl text-center text-red-500 mx-auto mt-32">
            Something went wrong.
          </h1>
          <p className="text-lg text-center text-gray-600 mx-auto mt-4">
            Please refresh the page and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
