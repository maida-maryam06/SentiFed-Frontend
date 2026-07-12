"use client";
import { useEffect, useState } from "react";

export default function ClientTime({ dateStr }: { dateStr: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date(dateStr).toLocaleTimeString());
  }, [dateStr]);

  return <span>{time || "—"}</span>;
}
