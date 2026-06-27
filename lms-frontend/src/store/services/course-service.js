import { backendURL } from "@/api/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseAPI = createApi({
  reducerPath: "courseAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendURL}/api`,
    credentials: "include",
  }),
  tagTypes: ["Courses"],
  endpoints: (builder) => ({
    fetchAllCourses: builder.query({
      query: () => "/courses",
      providesTags: (result = []) => [
        ...result.map((course) => ({ type: "Courses", id: course._id })),
        { type: "Courses", id: "LIST" },
      ],
    }),
    fetchCourseById: builder.query({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Courses", id: courseId },
      ],
    }),
    createCourse: builder.mutation({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),
    updateCourse: builder.mutation({
      query: ({ courseId, ...body }) => ({
        url: `/courses/${courseId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
        { type: "Courses", id: "LIST" },
      ],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Courses", id: "LIST" }],
    }),
    uploadThumbnail: builder.mutation({
      query: (formData) => ({
        url: "/courses/thumbnail",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useFetchAllCoursesQuery,
  useFetchCourseByIdQuery,
  useUpdateCourseMutation,
  useUploadThumbnailMutation,
} = courseAPI;

export default courseAPI;
