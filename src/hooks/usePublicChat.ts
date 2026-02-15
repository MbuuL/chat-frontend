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
      }
      catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (reconnectRef.current) {
        setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [queryClient]);

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
