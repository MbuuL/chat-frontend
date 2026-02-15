import { useQuery } from "@tanstack/react-query";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { apiGet, getUser } from "../../lib/api";

export function Left() {
  const matchRoute = useMatchRoute();
  const user = getUser();
  const isPublicActive = !!matchRoute({ to: "/home" });

  const { data } = useQuery({
    queryKey: ["privateRooms"],
    queryFn: () => apiGet<{ rooms: PrivateRoom[] }>("/chats/private/rooms"),
  });

  const rooms = data?.rooms ?? [];

  return (
    <div className="col-span-2 overflow-y-auto border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Chats</h3>

      <Link
        to="/home"
        className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
          isPublicActive
            ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
      >
        <span className="text-base">#</span>
        Public Chat
      </Link>

      {rooms.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Private
          </h4>
          {rooms.map((room) => {
            const otherUsername =
              room.user1 === user?.userId ? room.user2Username : room.user1Username;
            const isActive = !!matchRoute({ to: "/home/$roomId", params: { roomId: room.id } });

            return (
              <Link
                key={room.id}
                to="/home/$roomId"
                params={{ roomId: room.id }}
                className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {otherUsername.charAt(0).toUpperCase()}
                </span>
                {otherUsername}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
