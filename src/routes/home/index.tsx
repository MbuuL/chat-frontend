import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { apiGet, getUser } from "../../lib/api";
import { useSendMessage } from "../../hooks/usePublicChat";
import { useOnlineUsers } from "../../hooks/useOnlineUsers";
import { Main } from "../../components/ChatArea/Main";

export const Route = createFileRoute("/home/")({
  component: HomePage,
});

function HomePage() {
  const user = getUser();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendMessage();
  const { isOnline } = useOnlineUsers();
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

  return (
    <Main
      chats={chats}
      user={user}
      isLoading={isLoading}
      message={message}
      setMessage={setMessage}
      handleSend={handleSend}
      messagesEndRef={messagesEndRef}
      isOnline={isOnline}
    />
  );
}
