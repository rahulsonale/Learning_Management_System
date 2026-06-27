import { lazy, Suspense } from "react";
import { LoginForm } from "@/components/auth/login";
import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import AuthLayout from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/sign-up";
import DashboardLayout from "@/layouts/dashboard-layout";
import MainLayout from "@/layouts/main-layout";
import CourseDetailsPage from "@/pages/course-details";
import CreateCoursePage from "@/pages/create-course";
import DashboardPage from "@/pages/dashboard";
import HomePage from "@/pages/home";
import InstructorDashboardPage from "@/pages/instructor-dashboard";
import ManageCoursesPage from "@/pages/manage-courses";
import MyCoursesPage from "@/pages/my-courses";
import NotFoundPage from "@/pages/not-found";
import { ProtectedRoute, InstructorRoute } from "@/components/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";

const CoursePlayerPage = lazy(() => import("@/pages/course-player"));

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
        </Route>

        {/* <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/auth/signup" element={<Navigate to="/register" replace />} /> */}

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route
            path="player/:courseId"
            element={
              <Suspense
                fallback={
                  <p className="text-sm text-muted-foreground">
                    Loading player...
                  </p>
                }
              >
                <CoursePlayerPage />
              </Suspense>
            }
          />

          <Route element={<DashboardLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-courses"
              element={
                <ProtectedRoute>
                  <MyCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="instructor"
              element={
                <InstructorRoute>
                  <InstructorDashboardPage />
                </InstructorRoute>
              }
            />
            <Route
              path="instructor/create"
              element={
                <InstructorRoute>
                  <CreateCoursePage />
                </InstructorRoute>
              }
            />
            <Route
              path="instructor/manage"
              element={
                <InstructorRoute>
                  <ManageCoursesPage />
                </InstructorRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
