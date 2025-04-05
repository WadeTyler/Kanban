import {create} from "zustand";
import {ListItem} from "@/types/board.types";

interface BoardUIStore {
  resetBoardUI: () => void;

  focusedListItem: ListItem | null;
  setFocusedListItem: (listItem: ListItem | null) => void;
}

export const useBoardUIStore = create<BoardUIStore>((set) => ({
  // Reset Board UI
  resetBoardUI: () => {
    set({ focusedListItem: null });
  },

  // Focused List Item
  focusedListItem: null,
  setFocusedListItem: (listItem: ListItem | null) => {
    set({focusedListItem: listItem});
  }

}));
