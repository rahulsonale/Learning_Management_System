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
import { Link } from "react-router";
import { Switch } from "@/components/ui/switch";
import {
  useLoginMutation,
  useRegisterUserMutation,
} from "@/store/services/auth-service";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/slices/auth-slice";
import { getApiErrorMessage } from "@/lib/api-error";
import { resetApiState } from "@/store/reset-api-state";

export function SignupForm({ className, ...props }) {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleRegistration(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const role = formData.get("role") === "on" ? "instructor" : "student";

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "bottom-center" });
      return;
    }

    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        role,
      }).unwrap();
      const user = await login({ email, password }).unwrap();
      resetApiState(dispatch);
      dispatch(loginAction(user));
      toast.success("Account created.", { position: "bottom-center" });
      navigate(role === "instructor" ? "/instructor" : "/dashboard");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create account. Please try again.",
        ),
        {
          position: "bottom-center",
        },
      );
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration}>
            <FieldGroup>
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    name="firstName"
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    name="lastName"
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="role">Instructor</FieldLabel>
                <Switch name="role" id="role" />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      name="password"
                      id="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      name="confirm-password"
                      id="confirm-password"
                      type="password"
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading || isLoggingIn}>
                  {isLoading || isLoggingIn ? "Creating..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/auth">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
