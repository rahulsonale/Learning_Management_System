import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInstructorName, createImageUrl } from "@/lib/utils";
import { Link } from "react-router";

export function CourseCard({ course }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/10" />
      <img
        src={createImageUrl(course.thumbnail)}
        alt="Course thumbnail"
        className="relative z-20 aspect-video w-full object-fit"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{course.title}</CardTitle>

        <CardDescription>
          {getInstructorName(course.instructor)}
        </CardDescription>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to={`/courses/${course._id}`} className="w-full">
          <Button className="w-full">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
