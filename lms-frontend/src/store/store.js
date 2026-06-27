import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import authApi from "./services/auth-service";
import courseAPI from "./services/course-service";
import enrollmentApi from "./services/enrollment-service";
import lectureApi from "./services/lecture-service";
import { setupListeners } from "@reduxjs/toolkit/query";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    [lectureApi.reducerPath]: lectureApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(courseAPI.middleware)
      .concat(enrollmentApi.middleware)
      .concat(lectureApi.middleware),
});

setupListeners(store.dispatch);

export default store;
