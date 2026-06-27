import { backendURL } from "@/api/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lectureApi = createApi({
  reducerPath: "lectureApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendURL}/api`,
    credentials: "include",
  }),
  tagTypes: ["Lectures", "Courses"],
  endpoints: (builder) => ({
    fetchLecturesByCourse: builder.query({
      query: (courseId) => `/lectures?course=${courseId}`,
      providesTags: (result = []) => [
        ...result.map((lecture) => ({ type: "Lectures", id: lecture._id })),
        { type: "Lectures", id: "LIST" },
      ],
    }),
    fetchLectureById: builder.query({
      query: (lectureId) => `/lectures/${lectureId}`,
      providesTags: (result, error, lectureId) => [
        { type: "Lectures", id: lectureId },
      ],
    }),
    createLecture: builder.mutation({
      query: ({ courseId, ...body }) => ({
        url: `/lectures/course/${courseId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Lectures", id: "LIST" },
        { type: "Courses", id: "LIST" },
      ],
    }),
    updateLecture: builder.mutation({
      query: ({ lectureId, ...body }) => ({
        url: `/lectures/${lectureId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { lectureId }) => [
        { type: "Lectures", id: lectureId },
        { type: "Lectures", id: "LIST" },
      ],
    }),
    deleteLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lectures/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Lectures", id: "LIST" },
        { type: "Courses", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useFetchLectureByIdQuery,
  useFetchLecturesByCourseQuery,
  useUpdateLectureMutation,
} = lectureApi;

export default lectureApi;
