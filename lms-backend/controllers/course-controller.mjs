import multer from "multer";
import {
  createNewCourse,
  editCourse,
  fetchCourseById,
  fetchCourses,
  removeCourse,
} from "../services/course-service.mjs";

function getExtension(mimeType) {
  return mimeType?.split("/")[1];
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${getExtension(file.mimetype)}`,
    );
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
});

export function handleUpload(req, res, next) {
  upload.single("thumbnail")(req, res, (error) => {
    if (!error) {
      return next();
    }
    if (error instanceof multer.MulterError) {
      const message = {
        LIMIT_FILE_SIZE: "File cannot be greater than 5MB",
        LIMIT_UNEXPECTED_FILE: " Invalid file type. Only images are allowed",
      };
      return res.status(400).json({
        error: message[error.code],
        code: error.code,
      });
    }
  });
}

export async function thumbnailImage(req, res) {
  console.log(req.file);
  res.send({
    msg: `Thumbnail uploaded successfully`,
    thumbnailUrl: req.file.path,
  });
}

export async function getCourses(req, res) {
  try {
    const courses = await fetchCourses();
    res.json(courses);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch courses", error: ex.message });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await fetchCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch course", error: ex.message });
  }
}

export async function createCourse(req, res) {
  try {
    const { course, error, status } = await createNewCourse(req.user, req.body);

    if (error) {
      return res.status(status).json({ message: error });
    }
    res.status(201).json(course);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to create course", error: ex.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const { course, error, status } = await editCourse(
      req.user,
      req.params.id,
      req.body,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }
    res.json(course);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to update course", error: ex.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { message, error, status } = await removeCourse(
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
      .json({ message: "Unable to delete course", error: ex.message });
  }
}
