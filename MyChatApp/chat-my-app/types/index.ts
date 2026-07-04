export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  birthday?: string;
  bio?: string;
  isOnline?: boolean;
};

export type Chat = {
  _id: string;
  name: string;
  isGroup: boolean;
  members: User[];
  admins?: User[];
  lastMessage?: Message;
  locationSharingEnabled?: boolean;
};

export type Message = {
  _id: string;
  chatId: string;
  sender: User;
  text: string;
  type: "text" | "image" | "file" | "birthday" | "system";
  fileUrl?: string;
  privateMode?: boolean;
  expiresAt?: string | null;
  createdAt: string;
};

export type LiveLocation = {
  userId: string;
  name: string;
  chatId: string;
  lat: number;
  lng: number;
  updatedAt: string;
};