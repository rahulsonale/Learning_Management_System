import {
  cancelEnrollment,
  enrollInCourse,
  fetchEnrollmentById,
  fetchUserEnrollments,
  markLectureComplete,
} from "../services/enrollment-service.mjs";

export async function getMyEnrollments(req, res) {
  try {
    const enrollments = await fetchUserEnrollments(req.user.id);
    res.json(enrollments);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch enrollments", error: ex.message });
  }
}

export async function getEnrollmentById(req, res) {
  try {
    const { enrollment, error, status } = await fetchEnrollmentById(
      req.user,
      req.params.id,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.json(enrollment);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch enrollment", error: ex.message });
  }
}

export async function createEnrollment(req, res) {
  try {
    const { enrollment, error, status } = await enrollInCourse(
      req.user,
      req.params.courseId,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.status(201).json(enrollment);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to enroll in course", error: ex.message });
  }
}

export async function completeLecture(req, res) {
  try {
    const { enrollment, error, status } = await markLectureComplete(
      req.user,
      req.params.id,
      req.params.lectureId,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.json(enrollment);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to update progress", error: ex.message });
  }
}

export async function deleteEnrollment(req, res) {
  try {
    const { message, error, status } = await cancelEnrollment(
      req.user,
      req.params.id,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.json({ message });
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to cancel enrollment", error: ex.message });
  }
}
