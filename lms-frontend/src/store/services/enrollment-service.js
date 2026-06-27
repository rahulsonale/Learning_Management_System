import { backendURL } from "@/api/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendURL}/api`,
    credentials: "include",
  }),
  tagTypes: ["Enrollments"],
  endpoints: (builder) => ({
    fetchUserEnrollments: builder.query({
      query: () => "/enrollments",
      providesTags: (result = []) => [
        ...result.map((enrollment) => ({
          type: "Enrollments",
          id: enrollment._id,
        })),
        { type: "Enrollments", id: "LIST" },
      ],
    }),
    fetchEnrollmentById: builder.query({
      query: (enrollmentId) => `/enrollments/${enrollmentId}`,
      providesTags: (result, error, enrollmentId) => [
        { type: "Enrollments", id: enrollmentId },
      ],
    }),
    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: `/enrollments/course/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Enrollments", id: "LIST" }],
    }),
    markLectureComplete: builder.mutation({
      query: ({ enrollmentId, lectureId }) => ({
        url: `/enrollments/${enrollmentId}/lectures/${lectureId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { enrollmentId }) => [
        { type: "Enrollments", id: enrollmentId },
        { type: "Enrollments", id: "LIST" },
      ],
    }),
    cancelEnrollment: builder.mutation({
      query: (enrollmentId) => ({
        url: `/enrollments/${enrollmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Enrollments", id: "LIST" }],
    }),
  }),
});

export const {
  useCancelEnrollmentMutation,
  useEnrollInCourseMutation,
  useFetchEnrollmentByIdQuery,
  useFetchUserEnrollmentsQuery,
  useMarkLectureCompleteMutation,
} = enrollmentApi;

export default enrollmentApi;
