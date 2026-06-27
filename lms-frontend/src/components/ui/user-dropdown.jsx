import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/slices/auth-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useLogoutUserMutation } from "@/store/services/auth-service";
import { resetApiState } from "@/store/reset-api-state";

export default function UserDropdown({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout() {
    try {
      await logoutUser().unwrap();
    } catch {
      // Local logout still keeps the UI safe if the session has already expired.
    }
    resetApiState(dispatch);
    dispatch(logout());
    navigate("/auth");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Hello, {user.firstName || user.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
