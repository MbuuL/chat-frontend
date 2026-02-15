import { ThemeToggle } from "./ThemeToggle";
import { Popup } from "./Popup";

export function Navbar({ theme, toggleTheme, onlineUsers, initial, handleLogout }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat</span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          {onlineUsers.length}
          {" "}
          online
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <Popup
          items={[{ label: "Log out", onClick: handleLogout }]}
          classNames={{
            container: "relative",
            trigger: "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700",
          }}
        >
          {initial}
        </Popup>
      </div>
    </nav>
  );
}
