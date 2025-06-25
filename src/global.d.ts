export {};

declare global {
  const __USE_MOCKS__: boolean;

  interface Window {
    Telegram: {
      WebApp: {
        lockOrientation: () => void;
        unlockOrientation: () => void;
      };
    };
  }
}