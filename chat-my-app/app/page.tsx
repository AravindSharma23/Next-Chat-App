"use client";

import Link from "next/link";
import { MessageCircle, Sparkles, MapPin, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight">
          Chat<span className="gradient-text">Verse</span>
        </h1>

        /chat
          Launch App
        </Link>
      </nav>

      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
            <Sparkles size={16} />
            AI-style summaries, disappearing chats, live groups
          </div>

          <h2 className="text-5xl font-black leading-tight md:text-7xl">
            A futuristic chat app for your{" "}
            <span className="gradient-text">resume portfolio</span>
          </h2>

          <p className="mt-6 max-w-xl text-lg text-white/70">
            Built with Next.js, TypeScript, Redux, MongoDB, Tailwind CSS and
            Socket.io. Designed with modern glassmorphism, smart automation and
            privacy-first real-time features.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            /chat
              Start Chatting
            </Link>

            #features
              See Features
            </a>
          </div>
        </div>

        <div className="glass-card neon-border rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Live Group</p>
              <h3 className="text-xl font-bold">Design Squad</h3>
            </div>
            <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
              Online
            </div>
          </div>

          <div className="space-y-4">
            <div className="max-w-[80%] rounded-3xl rounded-tl-sm bg-white/10 p-4">
              Can we summarize last week's sprint chat?
            </div>
            <div className="ml-auto max-w-[80%] rounded-3xl rounded-tr-sm bg-violet-500 p-4">
              Yes, date-range summary is ready ✨
            </div>
            <div className="max-w-[80%] rounded-3xl rounded-tl-sm bg-white/10 p-4">
              Location sharing is on for the group.
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <FeatureMini icon={<MessageCircle size={18} />} text="Real-time" />
            <FeatureMini icon={<ShieldCheck size={18} />} text="Private" />
            <FeatureMini icon={<MapPin size={18} />} text="Live Map" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl pb-20">
        <h3 className="mb-8 text-3xl font-black">Standout Features</h3>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            "Chat summary by date range",
            "Auto birthday wishes",
            "24-hour disappearing private chat",
            "Consent-based live group location",
          ].map((item) => (
            <div key={item} className="glass-card rounded-3xl p-5">
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function FeatureMini({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <p className="text-xs text-white/70">{text}</p>
    </div>
  );
}