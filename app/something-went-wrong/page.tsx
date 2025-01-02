import { Card } from "../components/ui/card";
import { Text } from "../components/ui/text";
import { Heading } from "../components/ui/heading";
import { Link } from "../components/ui/link";

export default function SomethingWentWrong() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card title={<Heading>Something went wrong!</Heading>}>
        <div className="space-y-4">
          <Text>
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </Text>
          <div className="pt-4">
            <Link
              href="/"
              className="block w-full text-center px-3.5 py-2.5 text-sm font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Return home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
