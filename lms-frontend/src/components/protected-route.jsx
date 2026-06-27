import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router";
import { login, logout } from "@/store/slices/auth-slice";
import { useCurrentUserQuery } from "@/store/services/auth-service";

export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, error, isFetching } = useCurrentUserQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isFetching) return;
    if (data) dispatch(login(data));
    if (error) dispatch(logout());
  }, [data, dispatch, error, isFetching]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isFetching) {
    return <p className="text-sm text-muted-foreground">Checking session...</p>;
  }

  if (error) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export function InstructorRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, error, isFetching } = useCurrentUserQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isFetching) return;
    if (data) dispatch(login(data));
    if (error) dispatch(logout());
  }, [data, dispatch, error, isFetching]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isFetching) {
    return <p className="text-sm text-muted-foreground">Checking session...</p>;
  }

  if (error) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "instructor") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
