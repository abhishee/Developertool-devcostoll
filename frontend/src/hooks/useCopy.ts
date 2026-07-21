import { useState, useCallback } from "react";

export default function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
      return true;
    } catch (error) {
      console.error("Copy failed", error);
      setCopied(false);
      return false;
    }
  }, []);

  return [copied, copy] as const;
}
