import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[50svh] place-items-center text-center">
      <div className="grid gap-4">
        <h1 className="text-3xl font-semibold tracking-normal">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          The route you opened does not exist.
        </p>
        <Link to="/" className={buttonVariants()}>
          Go home
        </Link>
      </div>
    </div>
  );
}
