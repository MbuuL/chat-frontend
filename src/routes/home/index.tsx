import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { apiGet, getUser } from "../../lib/api";
import { Popup } from "../../components/Popup";
import { usePublicChat } from "../../hooks/usePublicChat";

export const Route = createFileRoute("/home/")({
  component: HomePage,
});

function HomePage() {
  const user = getUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = usePublicChat();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["publicChats"],
    queryFn: () => apiGet<{ chats: ChatMessage[] }>("/chats/public"),
  });

  const chats = data?.chats?.slice().reverse() ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setMessage("");
  };

  const initial = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <span className="text-lg font-semibold text-gray-900">Chat</span>
        <Popup
          items={[{ label: "Log out", onClick: handleLogout }]}
          classNames={{
            container: "relative",
            trigger: "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700",
          }}
        >
          {initial}
        </Popup>
      </nav>

      {/* Chat area: 2-8-2 grid */}
      <div className="grid min-h-0 flex-1 grid-cols-12">
        <div className="col-span-2" />
        <div className="col-span-8 flex flex-col border-x border-gray-200 bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading && (
              <p className="text-center text-sm text-gray-400">Loading...</p>
            )}

            {chats.map((chat) => {
              const isOwn = chat.fromId === user?.userId;
              return (
                <div
                  key={chat.id}
                  className={`mb-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md rounded-lg px-3 py-2 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    {!isOwn && (
                      <p className="mb-0.5 text-xs font-semibold text-gray-500">
                        {chat.from}
                      </p>
                    )}
                    <p className="text-sm">{chat.message}</p>
                    <p
                      className={`mt-1 text-right text-[10px] ${isOwn ? "text-blue-200" : "text-gray-400"}`}
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
            className="flex items-center gap-2 border-t border-gray-200 px-4 py-3"
          >
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
        <div className="col-span-2" />
      </div>
    </div>
  );
}
