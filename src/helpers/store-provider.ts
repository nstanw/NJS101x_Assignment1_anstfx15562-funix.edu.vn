import { createContext } from "react";
import MainStore from "../stores/mainStore";

export const StoreContext = createContext<MainStore>({} as MainStore);
export const StoreProvider =  StoreContext.Provider;