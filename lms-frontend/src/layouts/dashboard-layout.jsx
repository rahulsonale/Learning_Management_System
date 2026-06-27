import { Link, Outlet } from "react-router";
import { useSelector } from "react-redux";

const dashboardLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-courses", label: "My Courses" },
  { to: "/instructor", label: "Instructor Dashboard", roles: ["instructor"] },
  { to: "/instructor/create", label: "Create Course", roles: ["instructor"] },
  { to: "/instructor/manage", label: "Manage Courses", roles: ["instructor"] },
];

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const visibleDashboardLinks = dashboardLinks.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-lg border bg-card p-3">
        <nav className="grid gap-1 text-sm">
          {visibleDashboardLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
