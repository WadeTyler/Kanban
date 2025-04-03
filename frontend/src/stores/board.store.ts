import { create } from 'zustand';
import {Board, CreateBoardRequest} from "@/types/board.types";
import {API_URL} from "@/environment";
import {APIResponse} from "@/types/APIResponse.types";

interface BoardStore {
  isLoadingBoards: boolean;
  loadBoardsError: string;
  loadBoards: () => Promise<Board[] | null>;

  isCreatingBoard: boolean;
  createBoardError: string;
  createBoard: (createBoardRequest: CreateBoardRequest) => Promise<Board | null>
}

const useBoardStore = create<BoardStore>((set) => ({

  isLoadingBoards: false,
  loadBoardsError: '',
  loadBoards: async () => {
    set({ isLoadingBoards: true, loadBoardsError: '' });
    try {
      const response = await fetch(`${API_URL}/v1/boards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const apiResponse: APIResponse<Board[]> = await response.json();

      if (!response.ok || !apiResponse.success) {
        throw new Error(apiResponse.message);
      }

      return apiResponse.data;
    } catch (e) {
      set({ loadBoardsError: (e as Error).message || "Failed to load boards. Try again later." });
      return [];
    } finally {
      set({ isLoadingBoards: false });
    }
  },

  isCreatingBoard: false,
  createBoardError: '',
  createBoard: async (createBoardRequest: CreateBoardRequest) => {
    set({ isCreatingBoard: true, createBoardError: '' });
    try {
      const response = await fetch(`${API_URL}/v1/boards/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(createBoardRequest)
      });

      const apiResponse: APIResponse<Board> = await response.json();

      if (!response.ok || !apiResponse.data || !apiResponse.success) {
        throw new Error(apiResponse.message);
      }

      console.log("Data: ", apiResponse.data);

      return apiResponse.data;
    } catch (e) {
      set({ createBoardError: (e as Error).message || "Failed to create board." });
      return null;
    } finally {
      set({ isCreatingBoard: false });
    }
  }

}));

export default useBoardStore;