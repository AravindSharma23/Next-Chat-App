import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, Message } from "@/types";

type ChatState = {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  privateMode: boolean;
};

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  messages: [],
  privateMode: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },

    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
      state.messages = [];
    },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    setPrivateMode: (state, action: PayloadAction<boolean>) => {
      state.privateMode = action.payload;
    },
  },
});

export const {
  setChats,
  setSelectedChat,
  setMessages,
  addMessage,
  setPrivateMode,
} = chatSlice.actions;

export default chatSlice.reducer;