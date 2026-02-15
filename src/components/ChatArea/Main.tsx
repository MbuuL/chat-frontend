export function Main({
  chats,
  user,
  isLoading,
  message,
  setMessage,
  handleSend,
  messagesEndRef,
  isOnline,
}: ChatAreaMainProps) {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        )}

        {chats.map((chat) => {
          const isOwn = chat.fromId === user?.userId;
          return (
            <div
              key={chat.id}
              className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md rounded-lg px-3 py-2 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"}`}
              >
                {!isOwn && (
                  <p className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${isOnline(chat.fromId) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    />
                    {chat.from}
                  </p>
                )}
                <p className="text-sm">{chat.message}</p>
                <p
                  className={`mt-1 text-right text-[10px] ${isOwn ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {new Date(chat.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-800"
      >
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </>
  );
}
