"use client";

import { useState } from "react";
import { X, WandSparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function SummaryModal({ onClose }: { onClose: () => void }) {
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateSummary() {
    if (!selectedChat || !startDate || !endDate) return;

    setLoading(true);
    setSummary("");

    const res = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: selectedChat._id,
        startDate,
        endDate,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSummary(data.summary);
      setCount(data.count);
    } else {
      setSummary(data.message || "Failed to generate summary.");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl rounded-[2rem] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black gradient-text">
              Chat Summary
            </h2>
            <p className="text-sm text-white/50">
              Summarize selected date range for this chat.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-2 hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/50">Start date</label>
            <input
              type="datetime-local"
              className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-3 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-white/50">End date</label>
            <input
              type="datetime-local"
              className="mt-2 w-full rounded-2xl bg-white/10 px-4 py-3 outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={generateSummary}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3 font-black text-black transition hover:scale-[1.01] disabled:opacity-60"
        >
          <WandSparkles size={18} />
          {loading ? "Summarizing..." : "Generate Summary"}
        </button>

        {summary && (
          <div className="scroll-soft mt-5 max-h-80 overflow-y-auto rounded-3xl bg-black/30 p-5">
            {count !== null && (
              <p className="mb-3 text-sm text-cyan-300">
                Messages analyzed: {count}
              </p>
            )}

            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {summary}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}