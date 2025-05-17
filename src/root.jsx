import { useState, useEffect } from "react";
import App from "./App";

// Main component to handle app installation prompt
export default function Root() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the automatic mini-infobar
      setDeferredPrompt(e); // Save the event for later
      setIsInstallable(true); // Show the install button
    };

    if ("onbeforeinstallprompt" in window) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show the install prompt

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <>
      {isInstallable && (
        <button onClick={handleInstallClick}>Install App</button>
      )}
      <h1>My App</h1>
      <App />
    </>
  );
}
