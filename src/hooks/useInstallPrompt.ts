import { useCallback, useEffect, useState } from "react";

// Chromium fires this before offering its own install affordance.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Tracks whether the app can be installed and opens the browser install prompt.
export const useInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent>();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => setInstallEvent(undefined);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice;
    // The prompt event can only be used once, whichever choice was made.
    setInstallEvent(undefined);
  }, [installEvent]);

  return { canInstall: Boolean(installEvent), promptInstall };
};
