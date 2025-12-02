import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already in standalone mode
    const isInStandaloneMode = ('standalone' in window.navigator && (window.navigator as any).standalone) ||
                               window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS install prompt after 3 seconds if not installed
    if (isIOSDevice && !isInStandaloneMode) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (isStandalone || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-5 border-2 border-white/20">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3">
          <div className="text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Installer l'application
            </h3>
            <p className="text-white/90 text-sm mb-3">
              {isIOS
                ? "Ajoutez Party Game à votre écran d'accueil pour un accès rapide !"
                : "Installez l'application pour jouer hors ligne et accéder plus rapidement !"}
            </p>

            {isIOS ? (
              <div className="bg-white/10 rounded-lg p-3 text-sm text-white/90 space-y-2">
                <p className="font-semibold">Comment installer :</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Appuyez sur <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 14H4v-2h16v2z"/>
                    </svg>
                  </span> (Partager)</li>
                  <li>Sélectionnez "Sur l'écran d'accueil"</li>
                  <li>Appuyez sur "Ajouter"</li>
                </ol>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full bg-white text-primary-600 font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
              >
                Installer maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
