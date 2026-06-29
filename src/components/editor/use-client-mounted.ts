"use client";

import { useEffect, useState } from "react";

/** True after the client has mounted — gates browser-only DOM attrs (e.g. dnd-kit). */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
