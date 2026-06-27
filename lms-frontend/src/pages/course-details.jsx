import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchCourseByIdQuery } from "@/store/services/course-service";
import { getInstructorName } from "@/lib/utils";
import { LectureTable } from "@/components/ui/lecture/lecture";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEnrollInCourseMutation,
  useFetchUserEnrollmentsQuery,
} from "@/store/services/enrollment-service";
import { getApiErrorMessage, getCourseId } from "@/lib/api-error";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: course, error, isLoading } = useFetchCourseByIdQuery(id);
  const { data: enrollments = [] } = useFetchUserEnrollmentsQuery(undefined, {
    skip: !user,
  });
  const [enrollInCourse, { isLoading: isEnrolling }] =
    useEnrollInCourseMutation();
  const currentEnrollment = enrollments.find(
    (enrollment) => getCourseId(enrollment.course) === id,
  );

  async function handleEnroll() {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const enrollment = await enrollInCourse(id).unwrap();
      toast.success("You are enrolled.", { position: "bottom-center" });
      navigate(`/player/${getCourseId(enrollment.course) || id}`);
    } catch (enrollError) {
      toast.error(
        getApiErrorMessage(enrollError, "Unable to enroll in this course."),
        { position: "bottom-center" },
      );
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {getApiErrorMessage(error, "Unable to fetch course.")}
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="grid gap-4">
        <section className="grid gap-3 rounded-3xl bg-muted p-5">
          <h1 className="text-3xl font-semibold tracking-normal">
            {course?.title}
          </h1>
          <h2 className="text-muted-foreground">{course?.description}</h2>
          <h2>
            Created by -{" "}
            <span className="font-medium">
              {getInstructorName(course?.instructor)}
            </span>
          </h2>
          <p>
            Total Students:{" "}
            <span className="font-medium">{course?.totalStudents}</span>
          </p>
        </section>
        <section className="p-4 grid gap-4">
          <h2 className="text-2xl font-semibold">Course Content</h2>
          <LectureTable lectures={course?.lectures || []} />
        </section>
      </article>

      <Card>
        <CardHeader>
          <CardTitle>Start learning</CardTitle>
          <CardDescription>
            Enroll to unlock the full lecture player and progress tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {currentEnrollment ? (
            <Button disabled>Already enrolled</Button>
          ) : (
            <Button onClick={handleEnroll} disabled={isEnrolling}>
              {isEnrolling ? "Enrolling..." : "Enroll now"}
            </Button>
          )}
          <Link
            to={`/player/${id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            {currentEnrollment ? "Continue learning" : "Preview player"}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
