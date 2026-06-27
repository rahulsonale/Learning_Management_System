import Course from "../models/course.mjs";
import Enrollment from "../models/enrollment.mjs";
import Lecture from "../models/lecture.mjs";

export async function fetchUserEnrollments(userId) {
  return Enrollment.find({ user: userId })
    .populate("course", "title description thumbnail")
    .populate("completedLectures", "title duration")
    .sort({ createdAt: -1 });
}

export async function fetchEnrollmentById(user, enrollmentId) {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate("course")
    .populate("completedLectures");

  if (!enrollment) {
    return { status: 404, error: "Enrollment not found" };
  }

  if (enrollment.user.toString() !== user.id) {
    return { status: 403, error: "You cannot view this enrollment" };
  }

  return { enrollment };
}

export async function enrollInCourse(user, courseId) {
  const course = await Course.findById(courseId).select("_id");

  if (!course) {
    return { status: 404, error: "Course not found" };
  }

  try {
    const enrollment = await Enrollment.create({
      user: user.id,
      course: course._id,
    });

    await Course.findByIdAndUpdate(course._id, {
      $inc: { totalStudents: 1 },
    });

    return { enrollment };
  } catch (ex) {
    if (ex.code === 11000) {
      return { status: 409, error: "Already enrolled in this course" };
    }

    throw ex;
  }
}

export async function markLectureComplete(user, enrollmentId, lectureId) {
  const enrollment = await Enrollment.findById(enrollmentId).populate("course");

  if (!enrollment) {
    return { status: 404, error: "Enrollment not found" };
  }

  if (enrollment.user.toString() !== user.id) {
    return { status: 403, error: "You cannot update this enrollment" };
  }

  const lecture = await Lecture.findOne({
    _id: lectureId,
    course: enrollment.course._id,
  });

  if (!lecture) {
    return { status: 404, error: "Lecture not found in this course" };
  }

  if (!enrollment.completedLectures.includes(lecture._id)) {
    enrollment.completedLectures.push(lecture._id);
  }

  const totalLectures = enrollment.course.lectures.length;
  enrollment.progress = totalLectures
    ? Math.round((enrollment.completedLectures.length / totalLectures) * 100)
    : 0;

  await enrollment.save();
  return { enrollment };
}

export async function cancelEnrollment(user, enrollmentId) {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    return { status: 404, error: "Enrollment not found" };
  }

  if (enrollment.user.toString() !== user.id) {
    return { status: 403, error: "You cannot cancel this enrollment" };
  }

  await Course.findByIdAndUpdate(enrollment.course, {
    $inc: { totalStudents: -1 },
  });
  await enrollment.deleteOne();

  return { message: "Enrollment cancelled successfully" };
}
