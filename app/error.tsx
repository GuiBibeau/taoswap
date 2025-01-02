"use client"; // Error boundaries must be Client Components

import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Text } from "./components/ui/text";
import { Heading } from "./components/ui/heading";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card title={<Heading>Something went wrong!</Heading>}>
        <div className="space-y-4">
          <Text>
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </Text>
          {error.digest && (
            <Text className="font-mono text-sm">Error ID: {error.digest}</Text>
          )}
          <div className="pt-4">
            <Button onClick={() => reset()} className="w-full">
              Try again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
