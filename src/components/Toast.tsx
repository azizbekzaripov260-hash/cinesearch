"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "info" | "error";
};

let toastId = 0;
const listeners = new Set<(t: ToastItem) => void>();

export function showToast(message: string, type: ToastItem["type"] = "success") {
  const item = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(item));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3000);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in ${
            t.type === "success"
              ? "bg-green-600 text-white"
              : t.type === "error"
              ? "bg-red-600 text-white"
              : "bg-zinc-800 text-white border border-zinc-700"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
