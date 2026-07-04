"use client";

import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { addMessage } from "@/redux/features/chatSlice";
import { socket } from "@/lib/socket";

export default function ChatInput() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedChat, privateMode } = useSelector(
    (state: RootState) => state.chat
  );

  const [text, setText] = useState("");

  async function sendMessage() {
    if (!text.trim() || !selectedChat || !user) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        sender: user._id,
        text,
        privateMode,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(addMessage(data.data));
      socket.emit("send-message", data.data);
      setText("");
    }
  }

  function handleTyping(value: string) {
    setText(value);

    if (!selectedChat || !user) return;

    socket.emit("typing", {
      chatId: selectedChat._id,
      user,
    });

    setTimeout(() => {
      socket.emit("stop-typing", {
        chatId: selectedChat._id,
        user,
      });
    }, 1000);
  }

  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-2">
        <button className="rounded-2xl p-3 text-white/60 transition hover:bg-white/10 hover:text-white">
          <Smile size={20} />
        </button>

        <button className="rounded-2xl p-3 text-white/60 transition hover:bg-white/10 hover:text-white">
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder={
            privateMode
              ? "Private message will disappear after 24 hours..."
              : "Type your message..."
          }
          className="flex-1 bg-transparent px-2 outline-none placeholder:text-white/40"
        />

        <button
          onClick={sendMessage}
          className="rounded-2xl bg-violet-500 p-3 transition hover:scale-105"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}