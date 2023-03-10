import { useContext } from "react";
import { StoreContext } from "./store-provider";
import MainStore from "../stores/mainStore";

export const useStore = (): MainStore => useContext(StoreContext);
