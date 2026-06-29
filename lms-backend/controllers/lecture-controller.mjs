import {
  createLecture,
  editLecture,
  fetchLectureById,
  fetchLectures,
  removeLecture,
  summarizeLecture as summarize,
  chatWithLecture,
} from "../services/lecture-service.mjs";

export async function getLectures(req, res) {
  try {
    const lectures = await fetchLectures(req.query.course);
    // console.log(lectures)
    res.json(lectures);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch lectures", error: ex.message });
  }
}

export async function getLectureById(req, res) {
  try {
    const lecture = await fetchLectureById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.json(lecture);
  } catch (ex) {
    res
      .status(500)
      .json({ message: "Unable to fetch lecture", error: ex.message });
  }
}

export async function summarizeLecture(req, res) {
  try {
    const result = await summarize(req.params.id);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const reader = result.textStream.getReader();
    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(value);
        }
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).json({
            message: "Unable to summarize lecture",
            error: error.message,
          });
        }
      }
    };
    pump();
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Unable to summarize lecture", error: error.message });
    }
  }
}

export async function askLectureAI(req, res) {
  try {
    const { question } = req.body;

    const result = await chatWithLecture(req.params.id, question);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const reader = result.textStream.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        res.end();
        break;
      }

      res.write(value);
    }
  } catch (error) {
    res.status(500).json({
      message: "Unable to answer question",
      error: error.message,
    });
  }
}

export async function addLectureToCourse(req, res) {
  try {
    const courseId = req.params.courseId || req.params.id;
    const { lecture, error, status } = await createLecture(
      req.user,
      courseId,
      req.body,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.status(201).json(lecture);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to add lecture", error: ex.message });
  }
}

export async function updateLecture(req, res) {
  try {
    const { lecture, error, status } = await editLecture(
      req.user,
      req.params.id,
      req.body,
    );

    if (error) {
      return res.status(status).json({ message: error });
    }

    res.json(lecture);
  } catch (ex) {
    res
      .status(400)
      .json({ message: "Unable to update lecture", error: ex.message });
  }
}

export async function deleteLecture(req, res) {
  try {
    const { message, error, status } = await removeLecture(
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
      .json({ message: "Unable to delete lecture", error: ex.message });
  }
}
