import {create} from 'zustand';
import {Board, CreateBoardRequest} from "@/types/board.types";
import {API_URL} from "@/environment";
import {APIResponse} from "@/types/APIResponse.types";
import {User} from "@/types/auth.types";

interface BoardStore {
  isLoadingBoard: boolean;
  loadBoardError: string;
  loadBoard: (boardId: string) => Promise<Board | null>;

  isLoadingBoards: boolean;
  loadBoardsError: string;
  loadBoards: () => Promise<Board[] | null>;

  isCreatingBoard: boolean;
  createBoardError: string;
  createBoard: (createBoardRequest: CreateBoardRequest) => Promise<Board | null>

  isAddingMember: boolean;
  addMemberError: string;
  addMember: (boardId: string, email: string) => Promise<User[] | null>;

  isRemovingMember: boolean;
  removeMemberError: string;
  resetRemoveMemberError: () => void;
  removeMember: (boardId: string, memberId: string) => Promise<User[] | null>;

  isLeavingBoard: boolean;
  leaveBoardError: string;
  leaveBoard: (boardId: string) => Promise<boolean>;
}

const useBoardStore = create<BoardStore>((set) => ({

  isLoadingBoard: false,
  loadBoardError: "",
  loadBoard: async (boardId: string) => {
    set({isLoadingBoard: true, loadBoardError: ""});
    try {
      const response = await fetch(`${API_URL}/v1/boards/${boardId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const apiResponse: APIResponse<Board> = await response.json();

      if (!response.ok || !apiResponse.success) {
        throw new Error(apiResponse.message);
      }

      return apiResponse.data;
    } catch (e) {
      set({loadBoardError: (e as Error).message || "Failed to load board. Try again later."});
      return null;
    } finally {
      set({isLoadingBoard: false});
    }
  },

  isLoadingBoards: false,
  loadBoardsError: '',
  loadBoards: async () => {
    set({isLoadingBoards: true, loadBoardsError: ''});
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
      set({loadBoardsError: (e as Error).message || "Failed to load boards. Try again later."});
      return [];
    } finally {
      set({isLoadingBoards: false});
    }
  },

  isCreatingBoard: false,
  createBoardError: '',
  createBoard: async (createBoardRequest: CreateBoardRequest) => {
    set({isCreatingBoard: true, createBoardError: ''});
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
      set({createBoardError: (e as Error).message || "Failed to create board."});
      return null;
    } finally {
      set({isCreatingBoard: false});
    }
  },

  isAddingMember: false,
  addMemberError: '',
  addMember: async (boardId: string, email: string) => {
    set({ isAddingMember: true, addMemberError: ''});
    try {
      const response = await fetch(`${API_URL}/v1/boards/${boardId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({email})
      });

      const apiResponse: APIResponse<User[]> = await response.json();

      if (!response.ok || !apiResponse.success || !apiResponse.data)
        throw new Error(apiResponse.message);

      return apiResponse.data;
    } catch (e) {
      set({ addMemberError: (e as Error).message || "Failed to add member."});
      return null;
    } finally {
      set({ isAddingMember: false });
    }
  },

  isRemovingMember: false,
  removeMemberError: '',
  resetRemoveMemberError: () => {
    set({ removeMemberError: '' });
  },
  removeMember: async (boardId: string, memberId: string) => {
    set({ isRemovingMember: true, removeMemberError: ''});
    try {
      const response = await fetch(`${API_URL}/v1/boards/${boardId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const apiResponse: APIResponse<User[]> = await response.json();

      if (!response.ok || !apiResponse.success || !apiResponse.data)
        throw new Error(apiResponse.message);

      return apiResponse.data;
    } catch (e) {
      set({ removeMemberError: (e as Error).message || "Failed to remove member."});
      return null;
    } finally {
      set({ isRemovingMember: false });
    }
  },

  isLeavingBoard: false,
  leaveBoardError: '',
  leaveBoard: async (boardId: string) => {
    set({ isLeavingBoard: true, leaveBoardError: ''});
    try {
      const response = await fetch(`${API_URL}/v1/boards/${boardId}/members/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const apiResponse: APIResponse<null> = await response.json();

      if (!response.ok || !apiResponse.success)
        throw new Error(apiResponse.message);

      return apiResponse.success;
    } catch (e) {
      set({ leaveBoardError: (e as Error).message || "Failed to leave board."});
      return false;
    } finally {
      set({ isLeavingBoard: false });
    }
  },

}));

export default useBoardStore;