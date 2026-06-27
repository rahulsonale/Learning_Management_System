import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUserEnrollmentsQuery } from "@/store/services/enrollment-service";
import { getApiErrorMessage, getCourseId } from "@/lib/api-error";

export default function DashboardPage() {
  const {
    data: enrollments = [],
    error,
    isLoading,
  } = useFetchUserEnrollmentsQuery();
  const averageProgress = enrollments.length
    ? Math.round(
        enrollments.reduce(
          (total, enrollment) => total + (enrollment.progress || 0),
          0,
        ) / enrollments.length,
      )
    : 0;
  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.progress === 100,
  ).length;
  const recentEnrollments = enrollments.slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {getApiErrorMessage(error, "Unable to fetch dashboard.")}
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Student dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track enrolled courses and progress percentages.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Enrolled</CardDescription>
            <CardTitle className="text-3xl">{enrollments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Average progress</CardDescription>
            <CardTitle className="text-3xl">{averageProgress}%</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedCourses}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent courses</CardTitle>
          <CardDescription>
            Pick up from your latest enrollments.
          </CardDescription>
          <CardAction>
            <Link
              to="/my-courses"
              className="text-sm underline underline-offset-4"
            >
              View all
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recentEnrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No enrolled courses yet.
            </p>
          ) : (
            recentEnrollments.map((enrollment) => {
              const course = enrollment.course || {};
              const courseId = getCourseId(course);

              return (
                <div
                  key={enrollment._id}
                  className="grid gap-3 rounded-2xl border p-3 md:grid-cols-[1fr_auto]"
                >
                  <div className="grid gap-2">
                    <h2 className="font-medium">{course.title}</h2>
                    <Progress value={enrollment.progress || 0}>
                      <ProgressLabel>Progress</ProgressLabel>
                      <ProgressValue>{enrollment.progress || 0}%</ProgressValue>
                    </Progress>
                  </div>
                  <Link to={`/player/${courseId}`}>
                    <Button className="w-full md:w-auto">Continue</Button>
                  </Link>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
