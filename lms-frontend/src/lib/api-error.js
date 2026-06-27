export function getApiErrorMessage(
  error,
  fallback = "Failed to complete action. Please try again.",
) {
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.error ||
    error?.message ||
    fallback
  );
}

export function getCourseId(course) {
  return typeof course === "object" ? course?._id : course;
}

export function isUserCourseOwner(course, user) {
  const instructor = course?.instructor;
  const instructorId =
    typeof instructor === "object"
      ? instructor?._id || instructor?.id
      : instructor;
  return Boolean(user?.id && instructorId === user.id);
}
