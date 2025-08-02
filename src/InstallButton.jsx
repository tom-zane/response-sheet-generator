import { useEffect, useState } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  console.log("install button rendered");

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('App installed');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    isVisible && (
      <button
        onClick={handleInstallClick}
        className="p-2 text-2xl bg-gray-700 absolute top-0 right-0 m-4 cursor-pointer text-white rounded-md hover:bg-gray-900"
      >
        <MdOutlineFileDownload  />
        
        
      </button>
    )
  );
}

export default InstallButton;
