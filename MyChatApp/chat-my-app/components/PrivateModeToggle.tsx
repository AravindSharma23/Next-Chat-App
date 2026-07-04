"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setPrivateMode } from "@/redux/features/chatSlice";
import { ShieldCheck } from "lucide-react";

export default function PrivateModeToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const { privateMode } = useSelector((state: RootState) => state.chat);

  return (
    <button
      onClick={() => dispatch(setPrivateMode(!privateMode))}
      className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition ${
        privateMode
          ? "bg-rose-500/20 text-rose-300"
          : "bg-white/10 text-white/60 hover:bg-white/15"
      }`}
      title="Private messages disappear after 24 hours"
    >
      <ShieldCheck size={16} />
      {privateMode ? "Private ON" : "Private"}
    </button>
  );
}