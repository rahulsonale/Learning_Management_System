import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/slices/auth-slice";
import { useLoginMutation } from "@/store/services/auth-service";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import { resetApiState } from "@/store/reset-api-state";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      resetApiState(dispatch);
      const formData = new FormData(e.currentTarget);
      const result = await login({
        email: formData.get("email"),
        password: formData.get("password"),
      }).unwrap();

      dispatch(loginAction(result));
      toast.success("Welcome back.", { position: "bottom-center" });
      navigate(result.role === "instructor" ? "/instructor" : "/dashboard");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Login failed. Please try again."),
        { position: "bottom-center" },
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
