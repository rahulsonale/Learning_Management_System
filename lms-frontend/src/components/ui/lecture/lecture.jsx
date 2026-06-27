import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router";

export function LectureTable({ lectures }) {
  function getTotalDuration() {
    return lectures.reduce((total, lecture) => total + lecture.duration, 0);
  }

  function formatDuration(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""} ` : ""}${mins} min${mins !== 1 ? "s" : ""}`;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right"></TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lectures.map((lecture) => (
          <TableRow key={lecture._id}>
            <TableCell className="font-medium">{lecture.title}</TableCell>
            <TableCell>{lecture.description}</TableCell>
            <TableCell className="text-right">
              <Link
                to={`/player/${lecture.course}?lectureId=${lecture._id}`}
                className="text-blue-600 hover:underline"
              >
                Preview
              </Link>
            </TableCell>
            <TableCell className="text-right">
              {formatDuration(lecture.duration)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Duration</TableCell>
          <TableCell className="text-right">
            {formatDuration(getTotalDuration())}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
