// components/BaleReader.tsx
"use client";

import { useState } from "react";

export function BaleReader() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bale");
      const data = await res.json();
      setUpdates(data.updates || []);
    } catch (err) {
      alert("خطا در دریافت پیام‌ها");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <button
        onClick={fetchMessages}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "در حال دریافت..." : "دریافت پیام‌های جدید از بله"}
      </button>

      {updates.length > 0 && (
        <div className="mt-4 space-y-2">
          {updates.map((update, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded text-sm">
              {update.message?.text || "(پیام بدون متن)"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}