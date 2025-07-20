import { createContext } from "react";

export interface NavigationItem {
  path: string;
  label: string;
}

export const NavigationContext = createContext<NavigationItem[]>([]);
