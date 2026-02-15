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
