"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Message } from "@/types";
import { format } from "date-fns";
import { Lock, PartyPopper } from "lucide-react";

export default function MessageBubble({ message }: { message: Message }) {
  const { user } = useSelector((state: RootState) => state.auth);

  const isOwn = message.sender?._id === user?._id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-3xl px-4 py-3 ${
          message.type === "birthday"
            ? "bg-yellow-400/20 text-yellow-100"
            : isOwn
            ? "rounded-tr-sm bg-violet-500 text-white"
            : "rounded-tl-sm bg-white/10 text-white"
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-bold text-cyan-300">
            {message.sender?.name}
          </p>
        )}

        <div className="flex items-start gap-2">
          {message.type === "birthday" && <PartyPopper size={18} />}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.text}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
          {message.privateMode && (
            <span className="flex items-center gap-1">
              <Lock size={11} />
              expires in 24h
            </span>
          )}

          <span>{format(new Date(message.createdAt), "hh:mm a")}</span>
        </div>
      </div>
    </div>
  );
}