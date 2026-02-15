import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { apiGet, getUser } from "../../lib/api";
import { useSendPrivateMessage } from "../../hooks/usePublicChat";
import { useOnlineUsers } from "../../hooks/useOnlineUsers";
import { Main } from "../../components/ChatArea/Main";

export const Route = createFileRoute("/home/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  return <PrivateChat key={roomId} roomId={roomId} />;
}

function PrivateChat({ roomId }: { roomId: string }) {
  const user = getUser();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendPrivateMessage = useSendPrivateMessage();
  const { isOnline } = useOnlineUsers();

  const { data, isLoading } = useQuery({
    queryKey: ["privateChats", roomId],
    queryFn: () =>
      apiGet<{ chats: PrivateChatMessage[] }>(
        `/chats/private/rooms/${roomId}/messages`,
      ),
  });

  const chats: ChatMessage[] = (data?.chats?.slice().reverse() ?? []).map(c => ({
    ...c,
    to: null,
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendPrivateMessage(roomId, trimmed);
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
