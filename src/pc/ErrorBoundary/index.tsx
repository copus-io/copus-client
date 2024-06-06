import React from 'react';

class ErrorBoundary extends React.Component<
  any,
  { error: any; errorInfo: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    const { errorInfo } = this.state;
    const { children } = this.props;
    if (errorInfo) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <h2>Something went wrong.</h2>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
