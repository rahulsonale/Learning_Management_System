import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchLecturesByCourseQuery } from "@/store/services/lecture-service";
import {
  useFetchUserEnrollmentsQuery,
  useMarkLectureCompleteMutation,
} from "@/store/services/enrollment-service";
import { getApiErrorMessage, getCourseId } from "@/lib/api-error";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import ChatSheet from "@/components/ui/course/chat-sheet";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { backendURL } from "@/api/api";
import { IconSparkle } from "@tabler/icons-react";
export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedLectureId = searchParams.get("lectureId");
  const { user } = useSelector((state) => state.auth);
  const [currentLectureId, setCurrentLectureId] = useState(requestedLectureId);
  const activeLectureRef = useRef(null);
  const {
    data: lectures = [],
    error,
    isLoading,
  } = useFetchLecturesByCourseQuery(courseId);
  const { data: enrollments = [] } = useFetchUserEnrollmentsQuery(undefined, {
    skip: !user,
  });
  const [markLectureComplete, { isLoading: isCompleting }] =
    useMarkLectureCompleteMutation();

  const enrollment = enrollments.find(
    (item) => getCourseId(item.course) === courseId,
  );
  const completedLectureIds = useMemo(
    () =>
      new Set(
        (enrollment?.completedLectures || []).map((lecture) =>
          typeof lecture === "object" ? lecture?._id : lecture,
        ),
      ),
    [enrollment],
  );
  const effectiveLectureId = currentLectureId || requestedLectureId;
  const currentLecture =
    lectures.find((lecture) => lecture._id === effectiveLectureId) ||
    lectures[0];
  const currentIndex = lectures.findIndex(
    (lecture) => lecture._id === currentLecture?._id,
  );
  const isCurrentComplete = currentLecture
    ? completedLectureIds.has(currentLecture._id)
    : false;

  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    activeLectureRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentLecture?._id]);

  async function summarizeLecture() {
    if (!currentLecture) return;

    setIsSummarizing(true);
    setSummary("");
    setDisplayedSummary("");

    try {
      const res = await fetch(
        backendURL + `/api/lectures/${currentLecture._id}/summarize`,
        {
          method: "POST",
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      // Check if response is JSON (error response) or text stream
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Server error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullSummary = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        fullSummary += chunk;
        setSummary(fullSummary);
        containerRef.current?.lastElementChild?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }

      console.log("Full summary received:", fullSummary, typeof fullSummary);
      console.log("Setting summary to:", String(fullSummary));
      setSummary(fullSummary);
    } catch (error) {
      console.error("Error summarizing lecture:", error);
      toast.error("Failed to summarize lecture", { position: "bottom-center" });
    } finally {
      setIsSummarizing(false);
    }
  }

  async function handleCompleteLecture() {
    if (!enrollment || !currentLecture) return;

    try {
      await markLectureComplete({
        enrollmentId: enrollment._id,
        lectureId: currentLecture._id,
      }).unwrap();
      toast.success("Lecture completed.", { position: "bottom-center" });
      const nextLecture = lectures[currentIndex + 1];
      if (nextLecture) setCurrentLectureId(nextLecture._id);
    } catch (completeError) {
      toast.error(
        getApiErrorMessage(completeError, "Failed to mark lecture complete."),
        {
          position: "bottom-center",
        },
      );
    }
  }

  if (isLoading) {
    return (
      <main
        className="grid gap-4 lg:grid-cols-[1fr_280px]"
        aria-busy="true"
        aria-label="Loading course player"
      >
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="text-sm text-destructive">
          {getApiErrorMessage(error, "Unable to fetch lectures.")}
        </p>
      </main>
    );
  }

  return (
    <main className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <section aria-labelledby="current-lecture-title">
        <Card>
          <CardHeader>
            <CardTitle id="current-lecture-title">
              {currentLecture?.title || "Course player"}
            </CardTitle>
            <CardDescription>
              {currentLecture?.description || `Watching course ${courseId}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <figure className="grid aspect-video place-items-center overflow-hidden rounded-2xl bg-muted text-sm text-muted-foreground">
              {currentLecture?.videoUrl ? (
                <ReactPlayer
                  src={currentLecture.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              ) : (
                <p>No video available for this lecture.</p>
              )}
            </figure>
            {enrollment ? (
              <>
                <section
                  className="grid gap-3"
                  aria-label="Enrollment progress"
                >
                  <Progress value={enrollment.progress || 0}>
                    <ProgressLabel>Course progress</ProgressLabel>
                    <ProgressValue>{enrollment.progress || 0}%</ProgressValue>
                  </Progress>
                  <Button
                    className={"w-fit"}
                    onClick={handleCompleteLecture}
                    disabled={
                      !currentLecture || isCurrentComplete || isCompleting
                    }
                  >
                    {isCompleting
                      ? "Saving..."
                      : isCurrentComplete
                        ? "Lecture complete"
                        : "Mark as Complete"}
                  </Button>
                </section>
                {currentLecture?.transcript?.text && (
                  <section
                    className="grid gap-2 border-t pt-4"
                    aria-label="Lecture transcript"
                  >
                    <h3 className="font-semibold text-sm">Transcript</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto">
                      {currentLecture.transcript.text}
                    </p>
                  </section>
                )}
                <Button
                  className={"w-fit"}
                  onClick={summarizeLecture}
                  disabled={!currentLecture || isSummarizing}
                >
                  {isSummarizing ? "Summarizing..." : "Summarize lecture"}
                  <IconSparkle />
                </Button>
                {(summary || isSummarizing) && (
                  <section
                    className="grid gap-2 border-t pt-4"
                    aria-label="Lecture summary"
                  >
                    <h3 className="font-semibold text-sm">Summary</h3>
                    <div
                      ref={containerRef}
                      className="text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto"
                    >
                      <Markdown remarkPlugins={[remarkGfm]}>{summary}</Markdown>
                      {isSummarizing && displayedSummary === summary && (
                        <span className="animate-pulse">|</span>
                      )}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <section
                className="flex flex-wrap items-center gap-3"
                aria-label="Enrollment required"
              >
                <p className="text-sm text-muted-foreground">
                  Enroll to track progress for this course.
                </p>
                <Link to={`/courses/${courseId}`} className={buttonVariants()}>
                  View course
                </Link>
              </section>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <section
              className="w-full border-t pt-4 grid gap-4"
              aria-label="Lecture transcript"
            >
              <h3 className="font-semibold text-sm">Ask AI</h3>
              <ChatSheet lectureId={currentLecture?._id} />
            </section>
            <p className="text-sm text-muted-foreground self-center">
              {currentIndex + 1} of {lectures.length} lectures
            </p>
          </CardFooter>
        </Card>
      </section>
      <aside aria-labelledby="lecture-list-title">
        <Card>
          <CardHeader>
            <CardTitle id="lecture-list-title">Lectures</CardTitle>
            <CardDescription>
              Navigate lectures and mark progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {lectures.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No lectures available yet.
              </p>
            ) : (
              <nav aria-label="Course lectures">
                <ul className="grid gap-2">
                  {lectures.map((lecture, index) => {
                    const isActive = lecture._id === currentLecture?._id;
                    const isComplete = completedLectureIds.has(lecture._id);

                    return (
                      <li key={lecture._id}>
                        <button
                          type="button"
                          ref={isActive ? activeLectureRef : null}
                          onClick={() => setCurrentLectureId(lecture._id)}
                          aria-current={isActive ? "true" : undefined}
                          className={`flex w-full items-start gap-2 rounded-2xl px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="mt-0.5 size-4" />
                          ) : isActive ? (
                            <PlayCircle className="mt-0.5 size-4" />
                          ) : (
                            <Circle className="mt-0.5 size-4" />
                          )}
                          <span className="grid gap-1">
                            <span className="font-medium">
                              {index + 1}. {lecture.title}
                            </span>
                            <span
                              className={
                                isActive
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              }
                            >
                              {lecture.duration || 0} min
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
