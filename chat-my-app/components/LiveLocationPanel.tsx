"use client";

import { useEffect, useRef } from "react";
import { MapPin, Navigation, Radio } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setSharing } from "@/redux/features/locationSlice";
import { socket } from "@/lib/socket";

export default function LiveLocationPanel() {
  const dispatch = useDispatch<AppDispatch>();

  const watchId = useRef<number | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { sharing, liveLocations } = useSelector(
    (state: RootState) => state.location
  );

  function startSharing() {
    if (!selectedChat || !user) return;

    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    dispatch(setSharing(true));

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("share-location", {
          userId: user._id,
          name: user.name,
          chatId: selectedChat._id,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Location permission denied.");
        dispatch(setSharing(false));
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  function stopSharing() {
    dispatch(setSharing(false));

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-2">
          <MapPin className="text-cyan-300" />
          <h2 className="text-xl font-black">Live Location</h2>
        </div>

        <p className="mt-2 text-xs text-white/50">
          Share location only when you choose. Useful for trips, events and team
          meetups.
        </p>
      </div>

      <div className="p-5">
        {!selectedChat && (
          <p className="text-sm text-white/50">Select a chat to use location.</p>
        )}

        {selectedChat && (
          <button
            onClick={sharing ? stopSharing : startSharing}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold transition ${
              sharing
                ? "bg-rose-500/20 text-rose-300"
                : "bg-cyan-400 text-black"
            }`}
          >
            {sharing ? <Radio size={18} /> : <Navigation size={18} />}
            {sharing ? "Stop Sharing" : "Share My Location"}
          </button>
        )}
      </div>

      <div className="scroll-soft flex-1 overflow-y-auto px-5 pb-5">
        <h3 className="mb-3 text-sm font-bold text-white/60">
          Active locations
        </h3>

        {liveLocations.length === 0 && (
          <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/50">
            No live locations yet.
          </p>
        )}

        <div className="space-y-3">
          {liveLocations.map((location) => (
            <div key={location.userId} className="rounded-3xl bg-white/10 p-4">
              <p className="font-bold">{location.name}</p>

              <p className="mt-1 text-xs text-white/50">
                Lat: {location.lat.toFixed(4)} / Lng:{" "}
                {location.lng.toFixed(4)}
              </p>

              {`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                Open in Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}