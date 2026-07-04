"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "@/components/AuthForm";
import ChatList from "@/components/ChatList";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import SummaryModal from "@/components/SummaryModal";
import LiveLocationPanel from "@/components/LiveLocationPanel";

import { socket } from "@/lib/socket";
import { RootState, AppDispatch } from "@/redux/store";
import { loadCredentials } from "@/redux/features/authSlice";
import {
  addMessage,
  setChats,
  setMessages,
} from "@/redux/features/chatSlice";
import { updateLiveLocation } from "@/redux/features/locationSlice";
import { Message } from "@/types";

export default function ChatPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedChat, messages } = useSelector(
    (state: RootState) => state.chat
  );

  const [showSummary, setShowSummary] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    dispatch(loadCredentials());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("user-online", user._id);

    socket.on("receive-message", (message: Message) => {
      dispatch(addMessage(message));
    });

    socket.on("typing", (typingUser) => {
      setTypingUser(typingUser.name);
    });

    socket.on("stop-typing", () => {
      setTypingUser("");
    });

    socket.on("live-location-update", (location) => {
      dispatch(updateLiveLocation(location));
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("live-location-update");
    };
  }, [user, dispatch]);

  useEffect(() => {
    async function loadChats() {
      if (!user) return;

      const res = await fetch(`/api/chats?userId=${user._id}`);
      const data = await res.json();

      if (res.ok) {
        dispatch(setChats(data.chats));
      }
    }

    loadChats();
  }, [user, dispatch]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat) return;

      socket.emit("join-chat", selectedChat._id);

      const res = await fetch(`/api/messages?chatId=${selectedChat._id}`);
      const data = await res.json();

      if (res.ok) {
        dispatch(setMessages(data.messages));
      }
    }

    loadMessages();
  }, [selectedChat, dispatch]);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <main className="flex h-screen overflow-hidden p-4">
      <div className="grid h-full w-full grid-cols-12 gap-4">
        <aside className="glass-card col-span-3 overflow-hidden rounded-[2rem]">
          <ChatList />
        </aside>

        <section className="glass-card col-span-6 flex flex-col overflow-hidden rounded-[2rem]">
          {selectedChat ? (
            <>
              <ChatHeader onSummaryClick={() => setShowSummary(true)} />

              {typingUser && (
                <div className="px-5 py-2 text-xs text-cyan-300">
                  {typingUser} is typing...
                </div>
              )}

              <div className="scroll-soft flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {messages.map((message) => (
                  <MessageBubble key={message._id} message={message} />
                ))}
              </div>

              <ChatInput />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center">
              <div>
                <h2 className="text-3xl font-black gradient-text">
                  Select a chat
                </h2>
                <p className="mt-2 text-white/50">
                  Start messaging, summarizing and sharing live updates.
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="glass-card col-span-3 overflow-hidden rounded-[2rem]">
          <LiveLocationPanel />
        </aside>
      </div>

      {showSummary && (
        <SummaryModal onClose={() => setShowSummary(false)} />
      )}
    </main>
  );
}