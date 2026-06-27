import authApi from "@/store/services/auth-service";
import courseAPI from "@/store/services/course-service";
import enrollmentApi from "@/store/services/enrollment-service";
import lectureApi from "@/store/services/lecture-service";

export function resetApiState(dispatch) {
  dispatch(authApi.util.resetApiState());
  dispatch(courseAPI.util.resetApiState());
  dispatch(enrollmentApi.util.resetApiState());
  dispatch(lectureApi.util.resetApiState());
}
