import { useRef, useState } from "react";
import { authMessage } from "../services/memberService";

export default function useAsyncAction(action) {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (...args) => {
    if (running.current) return false;
    running.current = true;
    setBusy(true);
    setError("");
    try {
      await action(...args);
      return true;
    } catch (failure) {
      setError(authMessage(failure));
      return false;
    } finally {
      running.current = false;
      setBusy(false);
    }
  };
  return { run, busy, error, clearError: () => setError("") };
}
