export function Right({ onlineUsers }: { onlineUsers: OnlineUser[] }) {
  return (
    <div className="col-span-2 border-l border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Online</h3>
      <ul className="space-y-2">
        {onlineUsers.map(u => (
          <li key={u.userId} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
