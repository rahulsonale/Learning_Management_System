import { useState } from "react";
import { Edit, ListVideo, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteCourseMutation,
  useFetchAllCoursesQuery,
  useUpdateCourseMutation,
} from "@/store/services/course-service";
import {
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useFetchLecturesByCourseQuery,
  useUpdateLectureMutation,
} from "@/store/services/lecture-service";
import { getApiErrorMessage, isUserCourseOwner } from "@/lib/api-error";

// Component to fetch and display lecture count for a course
function LectureCountCell({ courseId }) {
  const { data: lectures = [] } = useFetchLecturesByCourseQuery(courseId);
  return <span>{lectures.length}</span>;
}

export default function ManageCoursesPage() {
  const { user } = useSelector((state) => state.auth);
  const { data: courses = [], error, isLoading } = useFetchAllCoursesQuery();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [createLecture, { isLoading: isCreatingLecture }] =
    useCreateLectureMutation();
  const [updateLecture, { isLoading: isUpdatingLecture }] =
    useUpdateLectureMutation();
  const [deleteLecture, { isLoading: isDeletingLecture }] =
    useDeleteLectureMutation();
  const [editingCourse, setEditingCourse] = useState(null);
  const [lectureCourse, setLectureCourse] = useState(null);
  const [managingLectureCourse, setManagingLectureCourse] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [deletingLecture, setDeletingLecture] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const {
    data: lectures = [],
    error: lecturesError,
    isLoading: isLoadingLectures,
  } = useFetchLecturesByCourseQuery(managingLectureCourse?._id, {
    skip: !managingLectureCourse,
  });
  const instructorCourses = courses.filter((course) =>
    isUserCourseOwner(course, user),
  );

  async function handleUpdateCourse(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await updateCourse({
        courseId: editingCourse._id,
        title: formData.get("title"),
        description: formData.get("description"),
        thumbnail: formData.get("thumbnail"),
      }).unwrap();
      toast.success("Course updated.", { position: "bottom-center" });
      setEditingCourse(null);
    } catch (updateError) {
      toast.error(getApiErrorMessage(updateError, "Unable to update course."), {
        position: "bottom-center",
      });
    }
  }

  async function handleCreateLecture(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createLecture({
        courseId: lectureCourse._id,
        title: formData.get("title"),
        description: formData.get("description"),
        videoUrl: formData.get("videoUrl"),
        duration: Number(formData.get("duration") || 0),
      }).unwrap();
      toast.success("Lecture added.", { position: "bottom-center" });
      setLectureCourse(null);
    } catch (createError) {
      toast.error(getApiErrorMessage(createError, "Unable to add lecture."), {
        position: "bottom-center",
      });
    }
  }

  async function handleUpdateLecture(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await updateLecture({
        lectureId: editingLecture._id,
        title: formData.get("title"),
        description: formData.get("description"),
        videoUrl: formData.get("videoUrl"),
        duration: Number(formData.get("duration") || 0),
      }).unwrap();
      toast.success("Lecture updated.", { position: "bottom-center" });
      setEditingLecture(null);
    } catch (updateError) {
      toast.error(
        getApiErrorMessage(updateError, "Unable to update lecture."),
        { position: "bottom-center" },
      );
    }
  }

  async function handleDeleteLecture() {
    if (!deletingLecture) return;

    try {
      await deleteLecture(deletingLecture._id).unwrap();
      toast.success("Lecture deleted.", { position: "bottom-center" });
      setDeletingLecture(null);
    } catch (deleteError) {
      toast.error(
        getApiErrorMessage(deleteError, "Unable to delete lecture."),
        { position: "bottom-center" },
      );
    }
  }

  async function handleDeleteCourse() {
    if (!deletingCourse) return;

    try {
      await deleteCourse(deletingCourse._id).unwrap();
      toast.success("Course deleted.", { position: "bottom-center" });
      setDeletingCourse(null);
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, "Unable to delete course."), {
        position: "bottom-center",
      });
    }
  }

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {getApiErrorMessage(error, "Unable to fetch courses.")}
      </p>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage courses</CardTitle>
          <CardDescription>
            Edit courses, delete courses, and add lectures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instructorCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Created courses will appear here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Lectures</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructorCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>
                      <div className="grid gap-1">
                        <span className="font-medium">{course.title}</span>
                        <span className="line-clamp-1 text-muted-foreground">
                          {course.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <LectureCountCell courseId={course._id} />
                    </TableCell>
                    <TableCell>{course.totalStudents || 0}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon-sm"
                          variant="secondary"
                          onClick={() => setLectureCourse(course)}
                        >
                          <Plus />
                          <span className="sr-only">Add lecture</span>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="secondary"
                          onClick={() => setManagingLectureCourse(course)}
                        >
                          <ListVideo />
                          <span className="sr-only">Manage lectures</span>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Edit />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => setDeletingCourse(course)}
                        >
                          <Trash2 />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editingCourse)}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>
              Update the course details students see in the catalog.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <form className="grid gap-4" onSubmit={handleUpdateCourse}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-title">Title</FieldLabel>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editingCourse.title}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingCourse.description}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-thumbnail">
                    Thumbnail URL
                  </FieldLabel>
                  <Input
                    id="edit-thumbnail"
                    name="thumbnail"
                    defaultValue={editingCourse.thumbnail || ""}
                  />
                  {/* <FileUpload
                    id="edit-thumbnail"
                    name="thumbnail"
                    title="Course thumbnail"
                    description="Upload an image to represent your course in the catalog."
                    buttonText="Change thumbnail"
                  /> */}
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(lectureCourse)}
        onOpenChange={(open) => !open && setLectureCourse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add lecture</DialogTitle>
            <DialogDescription>
              Add a video lecture to {lectureCourse?.title}.
            </DialogDescription>
          </DialogHeader>
          {lectureCourse && (
            <form className="grid gap-4" onSubmit={handleCreateLecture}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="lecture-title">Title</FieldLabel>
                  <Input id="lecture-title" name="title" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lecture-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="lecture-description"
                    name="description"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lecture-video">Video URL</FieldLabel>
                  <Input id="lecture-video" name="videoUrl" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lecture-duration">
                    Duration in minutes
                  </FieldLabel>
                  <Input
                    id="lecture-duration"
                    name="duration"
                    type="number"
                    min="0"
                    required
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" disabled={isCreatingLecture}>
                  {isCreatingLecture ? "Adding..." : "Add lecture"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(managingLectureCourse)}
        onOpenChange={(open) => {
          if (!open) {
            setManagingLectureCourse(null);
            setEditingLecture(null);
            setDeletingLecture(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage lectures</DialogTitle>
            <DialogDescription>
              Edit or remove lectures in {managingLectureCourse?.title}.
            </DialogDescription>
          </DialogHeader>
          {isLoadingLectures ? (
            <Skeleton className="h-48" />
          ) : lecturesError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(lecturesError, "Unable to fetch lectures.")}
            </p>
          ) : lectures.length === 0 ? (
            <div className="grid gap-3 rounded-2xl border p-4">
              <p className="text-sm text-muted-foreground">
                No lectures have been added yet.
              </p>
              <Button
                type="button"
                className="w-fit"
                onClick={() => {
                  setLectureCourse(managingLectureCourse);
                  setManagingLectureCourse(null);
                }}
              >
                Add lecture
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lecture</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectures.map((lecture) => (
                  <TableRow key={lecture._id}>
                    <TableCell>
                      <div className="grid gap-1">
                        <span className="font-medium">{lecture.title}</span>
                        <span className="line-clamp-1 text-muted-foreground">
                          {lecture.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{lecture.duration || 0} min</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => setEditingLecture(lecture)}
                        >
                          <Edit />
                          <span className="sr-only">Edit lecture</span>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => setDeletingLecture(lecture)}
                        >
                          <Trash2 />
                          <span className="sr-only">Delete lecture</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingLecture)}
        onOpenChange={(open) => !open && setEditingLecture(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit lecture</DialogTitle>
            <DialogDescription>
              Update lecture details and video metadata.
            </DialogDescription>
          </DialogHeader>
          {editingLecture && (
            <form className="grid gap-4" onSubmit={handleUpdateLecture}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-lecture-title">Title</FieldLabel>
                  <Input
                    id="edit-lecture-title"
                    name="title"
                    defaultValue={editingLecture.title}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-lecture-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="edit-lecture-description"
                    name="description"
                    defaultValue={editingLecture.description}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-lecture-video">
                    Video URL
                  </FieldLabel>
                  <Input
                    id="edit-lecture-video"
                    name="videoUrl"
                    defaultValue={editingLecture.videoUrl}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="edit-lecture-duration">
                    Duration in minutes
                  </FieldLabel>
                  <Input
                    id="edit-lecture-duration"
                    name="duration"
                    type="number"
                    min="0"
                    defaultValue={editingLecture.duration || 0}
                    required
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" disabled={isUpdatingLecture}>
                  {isUpdatingLecture ? "Saving..." : "Save lecture"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletingCourse)}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deletingCourse?.title} and its lectures. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deletingLecture)}
        onOpenChange={(open) => !open && setDeletingLecture(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lecture?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deletingLecture?.title} from the course. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingLecture}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLecture}
              disabled={isDeletingLecture}
            >
              {isDeletingLecture ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
