import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function MyCoursesPage() {
  const {
    data: enrollments = [],
    error,
    isLoading,
  } = useFetchUserEnrollmentsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {getApiErrorMessage(error, "Unable to fetch your courses.")}
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My courses</h1>
        <p className="text-sm text-muted-foreground">
          View courses you are enrolled in.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No courses enrolled</CardTitle>
            <CardDescription>
              Browse the catalog and enroll in a course to start learning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/" className={buttonVariants()}>
              Explore courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {enrollments.map((enrollment) => {
            const course = enrollment.course || {};
            const courseId = getCourseId(course);

            return (
              <Card key={enrollment._id} className="pt-0">
                <img
                  src={course.thumbnail || "https://avatar.vercel.sh/course"}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={enrollment.progress || 0}>
                    <ProgressLabel>Progress</ProgressLabel>
                    <ProgressValue>{enrollment.progress || 0}%</ProgressValue>
                  </Progress>
                </CardContent>
                <CardFooter>
                  <Link to={`/player/${courseId}`} className="w-full">
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
