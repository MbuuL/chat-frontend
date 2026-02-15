interface LoginResponse {
  message: string;
  token: string;
  user: { id: string; username: string };
}

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

interface PopupItem {
  label: string;
  onClick: () => void;
}

interface PopupClassNames {
  container?: string;
  trigger?: string;
  dropdown?: string;
  item?: string;
}

interface PopupProps {
  children: ReactNode;
  items: PopupItem[];
  classNames?: PopupClassNames;
}

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  onlineUsers: OnlineUser[];
  initial: string;
  handleLogout: () => void;
}

interface ChatAreaMainProps {
  chats: ChatMessage[];
  user: { userId: string; username: string } | null;
  isLoading: boolean;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isOnline: (userId: string) => boolean;
}
