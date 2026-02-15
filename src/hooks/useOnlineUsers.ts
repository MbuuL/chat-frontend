import { useQuery } from "@tanstack/react-query";

export function useOnlineUsers() {
  const { data: onlineUsers = [] } = useQuery<OnlineUser[]>({
    queryKey: ["onlineUsers"],
    enabled: false,
    initialData: [],
  });

  const isOnline = (userId: string): boolean =>
    onlineUsers.some(u => u.userId === userId);

  return { onlineUsers, isOnline };
}
