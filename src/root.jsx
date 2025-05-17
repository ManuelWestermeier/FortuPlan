import { useState, useEffect } from "react";
import App from "./App";

export default function Root() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the browser's default prompt
      setDeferredPrompt(e); // Save the event for triggering later
      setIsInstallable(true); // Show the "Install" button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Trigger browser install prompt

    const choiceResult = await deferredPrompt.userChoice;
    console.log(
      choiceResult.outcome === "accepted"
        ? "User accepted the install prompt"
        : "User dismissed the install prompt"
    );

    setDeferredPrompt(null);
    setIsInstallable(false); // Hide button after interaction
  };

  return (
    <>
      {isInstallable && (
        <button onClick={handleInstallClick}>
          Install App
        </button>
      )}
      <App />
    </>
  );
}
