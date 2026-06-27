import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllCoursesQuery } from "@/store/services/course-service";
import { getApiErrorMessage, isUserCourseOwner } from "@/lib/api-error";
import { createImageUrl } from "@/lib/utils";

export default function InstructorDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { data: courses = [], error, isLoading } = useFetchAllCoursesQuery();
  const instructorCourses = courses.filter((course) =>
    isUserCourseOwner(course, user),
  );
  const totalStudents = instructorCourses.reduce(
    (total, course) => total + (course.totalStudents || 0),
    0,
  );
  const trendingCourse = instructorCourses.reduce((topCourse, course) => {
    if (
      !topCourse ||
      (course.totalStudents || 0) > (topCourse.totalStudents || 0)
    )
      return course;
    return topCourse;
  }, null);

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Instructor dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review created courses and total student counts.
          </p>
        </div>
        <Link to="/instructor/create">
          <Button>Create New Course</Button>
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Created courses</CardDescription>
            <CardTitle className="text-3xl">
              {instructorCourses.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Total students</CardDescription>
            <CardTitle className="text-3xl">{totalStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Trending course</CardDescription>
            <CardTitle className="line-clamp-1">
              {trendingCourse?.title || "No courses yet"}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Your courses</CardTitle>
          <CardDescription>
            Manage course details and add lectures.
          </CardDescription>
          <CardAction>
            <Link
              to="/instructor/manage"
              className="text-sm underline underline-offset-4"
            >
              Manage all
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {instructorCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground md:col-span-2">
              Created courses will appear here.
            </p>
          ) : (
            instructorCourses.slice(0, 4).map((course) => (
              <div
                key={course._id}
                className="grid gap-3 rounded-2xl border p-3"
              >
                <img
                  src={
                    createImageUrl(course.thumbnail) ||
                    "https://avatar.vercel.sh/course"
                  }
                  alt=""
                  className="aspect-auto w-full rounded-2xl object-fit"
                />
                <div className="grid gap-1">
                  <h2 className="font-medium">{course.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {course.totalStudents || 0} students
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/courses/${course._id}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                  <Link to="/instructor/manage">
                    <Button variant="outline">Edit</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
 