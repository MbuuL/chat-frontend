import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  fromId: string;
  from: string;
  to: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface OnlineUser {
  userId: string;
  username: string;
}

function getWsUrl(token: string): string {
  const httpUrl = import.meta.env.VITE_BACKEND_URL as string;
  const url = new URL(httpUrl);
  const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${url.host}/ws?token=${encodeURIComponent(token)}`;
}

export function usePublicChat() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef(true);
  const connectRef = useRef<() => void>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(getWsUrl(token));
    wsRef.current = ws;

    ws.onopen = () => {
      queryClient.invalidateQueries({ queryKey: ["publicChats"] });
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "new_message" && data.chat) {
          queryClient.setQueryData<{ chats: ChatMessage[] }>(
            ["publicChats"],
            (old) => {
              if (!old) return { chats: [data.chat] };
              return { chats: [data.chat, ...old.chats] };
            },
          );
        }

        if (data.type === "online_users" && Array.isArray(data.users)) {
          queryClient.setQueryData<OnlineUser[]>(["onlineUsers"], data.users);
        }

        if (data.type === "user_online" && data.userId) {
          queryClient.setQueryData<OnlineUser[]>(["onlineUsers"], (old) => {
            const current = old ?? [];
            if (current.some(u => u.userId === data.userId)) return current;
            return [...current, { userId: data.userId, username: data.username }];
          });
        }

        if (data.type === "user_offline" && data.userId) {
          queryClient.setQueryData<OnlineUser[]>(["onlineUsers"], (old) => {
            if (!old) return [];
            return old.filter(u => u.userId !== data.userId);
          });
        }
      }
      catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      queryClient.setQueryData<OnlineUser[]>(["onlineUsers"], []);
      if (reconnectRef.current) {
        setTimeout(() => connectRef.current?.(), 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [queryClient]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    reconnectRef.current = true;
    connect();

    return () => {
      reconnectRef.current = false;
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "send_message", message }));
    }
  }, []);

  return { sendMessage };
}
