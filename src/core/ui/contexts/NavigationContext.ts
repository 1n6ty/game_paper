import { createContext } from "react";

export interface INavigationItem {
  path: string;
  label: string;
}

export const NavigationContext = createContext<INavigationItem[]>([]);
