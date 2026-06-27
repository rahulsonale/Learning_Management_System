import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllCoursesQuery } from "@/store/services/course-service";
import { CourseCard } from "@/components/ui/course/course-card";
import { getApiErrorMessage } from "@/lib/api-error";

export default function HomePage() {
  const { data: courses, error, isLoading } = useFetchAllCoursesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const allCourses = useMemo(() => courses || [], [courses]);
  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allCourses;

    return allCourses.filter((course) => {
      const instructor =
        typeof course.instructor === "object" ? course.instructor : {};
      const instructorName = `${instructor.firstName || ""} ${instructor.lastName || ""} ${instructor.email || ""}`;
      return `${course.title || ""} ${course.description || ""} ${instructorName}`
        .toLowerCase()
        .includes(term);
    });
  }, [allCourses, searchTerm]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Learn at your pace
        </p>
        <div className="grid gap-3">
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            Explore practical courses
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse courses, enroll as a student, or create curriculum as an
            instructor.
          </p>
        </div>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search courses..."
          className="max-w-md"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-4xl border bg-card p-4"
            >
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}

        {!isLoading && error && (
          <p className="text-sm text-destructive md:col-span-3">
            {getApiErrorMessage(error, "Unable to fetch courses.")}
          </p>
        )}

        {!isLoading && !error && allCourses.length === 0 && (
          <p className="text-sm text-muted-foreground md:col-span-3">
            No courses available yet.
          </p>
        )}

        {!isLoading &&
          !error &&
          allCourses.length > 0 &&
          filteredCourses.length === 0 && (
            <p className="text-sm text-muted-foreground md:col-span-3">
              No courses match your search.
            </p>
          )}

        {!isLoading &&
          !error &&
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
      </section>
    </div>
  );
}
