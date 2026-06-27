import Course from "../models/course.mjs";
import Lecture from "../models/lecture.mjs";

function isInstructor(user) {
  return user?.role === "instructor";
}

function canManageCourse(user, course) {
  return isInstructor(user) && course.instructor.toString() === user.id;
}

export async function fetchCourses() {
  return Course.find()
    .populate("instructor", "firstName lastName email")
    .select("-lectures")
    .sort({ createdAt: -1 });
}

export async function fetchCourseById(id) {
  return Course.findById(id)
    .populate("instructor", "firstName lastName email")
    .populate("lectures");
}

export async function createNewCourse(user, courseData) {
  if (!isInstructor(user)) {
    return { status: 403, error: "Only instructors can create courses" };
  }

  const { title, description, thumbnail } = courseData;
  const course = await Course.create({
    title,
    description,
    thumbnail,
    instructor: user.id,
    totalStudents: 0,
  });

  return { course };
}

export async function editCourse(user, courseId, updates) {
  const course = await Course.findById(courseId);

  if (!course) {
    return { status: 404, error: "Course not found" };
  }

  if (!canManageCourse(user, course)) {
    return { status: 403, error: "You cannot update this course" };
  }

  const allowedUpdates = ["title", "description", "thumbnail"];
  for (const field of allowedUpdates) {
    if (updates[field] !== undefined) {
      course[field] = updates[field];
    }
  }

  await course.save();
  return { course };
}

export async function removeCourse(user, courseId) {
  const course = await Course.findById(courseId);

  if (!course) {
    return { status: 404, error: "Course not found" };
  }

  if (!canManageCourse(user, course)) {
    return { status: 403, error: "You cannot delete this course" };
  }

  await Lecture.deleteMany({ course: course._id });
  await course.deleteOne();
  return { message: "Course deleted successfully" };
}
