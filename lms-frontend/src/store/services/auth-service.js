// Need to use the React-specific entry point to import createApi
import { backendURL } from "@/api/api";
console.log("backendURL =", backendURL);
console.log("env =", import.meta.env.VITE_BACKEND_URL);
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendURL}/api/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    currentUser: builder.query({
      query: () => "/me",
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
} = authApi;

export default authApi;
