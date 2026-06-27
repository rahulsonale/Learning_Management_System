import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { useSelector } from "react-redux";
import UserDropdown from "@/components/ui/user-dropdown";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-courses", label: "My Courses" },
  { to: "/instructor", label: "Instructor", roles: ["instructor"] },
];
export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const visibleNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <header className="border-b bg-card">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-lg font-semibold">
          LMS
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {visibleNavigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <UserDropdown user={user} />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/auth"
              className={cn(
                buttonVariants({ variant: "default" }),
                "px-3 py-1 text-sm font-medium",
              )}
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
