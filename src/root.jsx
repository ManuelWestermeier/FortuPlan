import { useState, useEffect } from "react";
import App from "./App";

// Main component to handle app installation prompt
export default function Root() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Listen for 'beforeinstallprompt' to detect when the app can be installed
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default install prompt
      setDeferredPrompt(e); // Store the event for later use
      setIsInstallable(true); // Set the app as installable
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null); // Clear the stored prompt event
        setIsInstallable(false); // Reset installable state
      });
    }
  };

  return (
    <>
      <h1>
        {isInstallable && (
          <button onClick={handleInstallClick}>Install App</button>
        )}
      </h1>
      <App />
    </>
  );
}
