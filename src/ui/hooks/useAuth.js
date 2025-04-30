import { useState } from "react";

export const useAuth = () => {
  const [canEditSettings, setCanEditSettings] = useState(false);

  return { canEditSettings };
};