"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setSelectedChat } from "@/redux/features/chatSlice";
import { MessageCircle, Search } from "lucide-react";

export default function ChatList() {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, selectedChat } = useSelector((state: RootState) => state.chat);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-2xl font-black">Messages</h2>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
          <Search size={16} className="text-white/40" />
          <input
            placeholder="Search chats..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="scroll-soft flex-1 overflow-y-auto p-3">
        {chats.length === 0 && (
          <p className="p-4 text-sm text-white/50">
            No chats yet. Create chats from API or seed data.
          </p>
        )}

        {chats.map((chat) => {
          const active = selectedChat?._id === chat._id;

          return (
            <button
              key={chat._id}
              onClick={() => dispatch(setSelectedChat(chat))}
              className={`mb-2 flex w-full items-center gap-3 rounded-3xl p-3 text-left transition ${
                active ? "bg-violet-500/30" : "hover:bg-white/10"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400">
                <MessageCircle size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold">
                  {chat.isGroup
                    ? chat.name
                    : chat.members?.map((m) => m.name).join(", ")}
                </h3>

                <p className="truncate text-xs text-white/50">
                  {chat.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}