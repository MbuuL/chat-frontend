import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { apiAuthPost, apiGet, getUser } from "../../lib/api";

export function Right({ onlineUsers }: { onlineUsers: OnlineUser[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();

  const handleUserClick = async (otherUserId: string) => {
    try {
      await apiAuthPost("/chats/private/rooms", { otherUserId });
    } catch {
      // 409 means room already exists — that's fine
    }

    const { rooms } = await apiGet<{ rooms: PrivateRoom[] }>("/chats/private/rooms");
    const room = rooms.find(
      (r) => r.user1 === otherUserId || r.user2 === otherUserId,
    );

    if (room) {
      queryClient.setQueryData(["privateRooms"], { rooms });
      navigate({ to: "/home/$roomId", params: { roomId: room.id } });
    }
  };

  return (
    <div className="col-span-2 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Online</h3>
      <ul className="space-y-2">
        {onlineUsers.map(u => (
          <li key={u.userId} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {u.userId === user?.userId ? (
              <span>{u.username}</span>
            ) : (
              <button
                type="button"
                onClick={() => handleUserClick(u.userId)}
                className="cursor-pointer hover:text-blue-600 hover:underline dark:hover:text-blue-400"
              >
                {u.username}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
