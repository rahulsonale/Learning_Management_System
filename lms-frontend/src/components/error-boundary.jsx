import { Component } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled React error", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4">
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              The app hit an unexpected error. Try again or refresh the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={this.handleRetry}>Try again</Button>
          </CardContent>
        </Card>
      </main>
    );
  }
}
