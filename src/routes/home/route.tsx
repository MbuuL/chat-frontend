import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Navbar } from "../../components/Navbar";
import { useTheme } from "../../hooks/useTheme";
import { useOnlineUsers } from "../../hooks/useOnlineUsers";
import { usePublicChat } from "../../hooks/usePublicChat";
import { getUser } from "../../lib/api";
import { Left } from "../../components/ChatArea/Left";
import { Right } from "../../components/ChatArea/Right";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme, toggleTheme } = useTheme();
  const { onlineUsers } = useOnlineUsers();
  usePublicChat();
  const user = getUser();
  const navigate = useNavigate();

  const initial = user?.username?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
  };
  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onlineUsers={onlineUsers}
        initial={initial}
        handleLogout={handleLogout}
      />
      <div className="grid min-h-0 flex-1 grid-cols-12">
        <Left />
        <div className="col-span-8 flex flex-col border-x border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <Outlet />
        </div>
        <Right onlineUsers={onlineUsers} />
      </div>
    </div>
  );
}
