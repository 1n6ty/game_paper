export {};

declare global {
  const __USE_MOCKS__: boolean;

  interface Window {
    CSRF_TOKEN: string;
    Telegram: {
      WebApp: {
        lockOrientation: () => void;
        unlockOrientation: () => void;

        initData: null;
        initDataUnsafe: { user: null };
      };
    };
  }
}
