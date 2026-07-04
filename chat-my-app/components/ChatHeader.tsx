"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Bot, MapPin, MoreVertical } from "lucide-react";
import PrivateModeToggle from "./PrivateModeToggle";

export default function ChatHeader({
  onSummaryClick,
}: {
  onSummaryClick: () => void;
}) {
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  if (!selectedChat) return null;

  return (
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div>
        <h2 className="text-xl font-black">
          {selectedChat.isGroup
            ? selectedChat.name
            : selectedChat.members?.map((m) => m.name).join(", ")}
        </h2>

        <p className="text-xs text-white/50">
          {selectedChat.isGroup
            ? `${selectedChat.members?.length || 0} members`
            : "Private conversation"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <PrivateModeToggle />

        <button
          onClick={onSummaryClick}
          className="flex items-center gap-2 rounded-2xl bg-cyan-400/15 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/25"
        >
          <Bot size={16} />
          Summary
        </button>

        <button className="rounded-2xl bg-white/10 p-2 transition hover:bg-white/15">
          <MapPin size={18} />
        </button>

        <button className="rounded-2xl bg-white/10 p-2 transition hover:bg-white/15">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}