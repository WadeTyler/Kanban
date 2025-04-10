import {create} from 'zustand';
import {Board, CreateBoardRequest} from "@/types/board.types";
import {APIResponse} from "@/types/APIResponse.types";
import {User} from "@/types/auth.types";
import {http} from "@/lib/config/http.config";
import ResponseError from "@/lib/http/ResponseError";

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

  isPromotingMember: boolean;
  promoteMemberError: string;
  promoteMember: (boardId: string, memberId: string) => Promise<Board | null>;

  resetBoardErrors: () => void;
}

const useBoardStore = create<BoardStore>((set) => ({

  isLoadingBoard: false,
  loadBoardError: "",
  loadBoard: async (boardId: string) => {
    set({isLoadingBoard: true, loadBoardError: ""});

    return await http.get<APIResponse<Board>>(`/v1/boards/${boardId}`)
      .then((apiResponse) => {
        if (!apiResponse.success) {
          throw new Error(apiResponse.message);
        }
        return apiResponse.data;
      })
      .catch((e: ResponseError<APIResponse<Board>>) => {
        set({loadBoardError: e.data.message || e.message || "Failed to load board. Try again later."});
        return null;
      })
      .finally(() => {
        set({isLoadingBoard: false});
      });
  },

  isLoadingBoards: false,
  loadBoardsError: '',
  loadBoards: async () => {
    set({isLoadingBoards: true, loadBoardsError: ''});
    return await http.get<APIResponse<Board[]>>(`/v1/boards`)
      .then((apiResponse) => {
        if (apiResponse.success) {
          return apiResponse.data;
        } else {
          throw new Error(apiResponse.message);
        }
      })
      .catch((e: ResponseError<APIResponse<Board[]>>) => {
        set({loadBoardError: e.data.message || e.message || "Failed to load boards. Try again later."});
        return null;
      })
      .finally(() => {
        set({isLoadingBoards: false});
      });
  },

  isCreatingBoard: false,
  createBoardError: '',
  createBoard: async (createBoardRequest: CreateBoardRequest) => {
    set({isCreatingBoard: true, createBoardError: ''});

    return await http.post<APIResponse<Board>>(`/v1/boards/create`, createBoardRequest)
      .then((apiResponse: APIResponse<Board>) => {
        if (apiResponse.success) return apiResponse.data;
        throw new Error(apiResponse.message);
      })
      .catch((e: ResponseError<APIResponse<Board>>) => {
        set({createBoardError: e.data.message || e.message || "Failed to create board."});
        return null;
      })
      .finally(() => {
        set({isCreatingBoard: false});
      });
  },

  isAddingMember: false,
  addMemberError: '',
  addMember: async (boardId: string, email: string) => {
    set({isAddingMember: true, addMemberError: ''});

    return await http.post<APIResponse<User[]>>(`/v1/boards/${boardId}/members`, {email})
      .then((apiResponse: APIResponse<User[]>) => {
        if (apiResponse.success) return apiResponse.data;
        throw new Error(apiResponse.message);
      })
      .catch((e: ResponseError<APIResponse<User[]>>) => {
        set({addMemberError: e.data.message || e.message || "Failed to add member. Try again later."});
        return null;
      })
      .finally(() => {
        set({isAddingMember: false});
      });
  },

  isRemovingMember: false,
  removeMemberError: '',
  resetRemoveMemberError: () => {
    set({removeMemberError: ''});
  },
  removeMember: async (boardId: string, memberId: string) => {
    set({isRemovingMember: true, removeMemberError: ''});
    return await http.delete<APIResponse<User[]>>(`/v1/boards/${boardId}/members/${memberId}`)
      .then((apiResponse: APIResponse<User[]>) => {
        if (apiResponse.success) return apiResponse.data;
        throw new Error(apiResponse.message);
      })
      .catch((e: ResponseError<APIResponse<User[]>>) => {
        set({removeMemberError: e.data.message || e.message || "Failed to remove member. Try again later."});
        return null;
      })
      .finally(() => {
        set({isRemovingMember: false});
      });
  },

  isLeavingBoard: false,
  leaveBoardError: '',
  leaveBoard: async (boardId: string) => {
    set({isLeavingBoard: true, leaveBoardError: ''});
    return await http.delete<APIResponse<null>>(`/v1/boards/${boardId}/members/leave`)
      .then((apiResponse) => {
        if (apiResponse.success) return apiResponse.success;
        throw new Error(apiResponse.message);
      })
      .catch((e: ResponseError<APIResponse<null>>) => {
        set({leaveBoardError: e.data.message || e.message || "Failed to leave board. Try again later."});
        return false;
      })
      .finally(() => {
        set({isLeavingBoard: false});
      });
  },

  isPromotingMember: false,
  promoteMemberError: '',
  promoteMember: async (boardId: string, memberId: string) => {
    set({isPromotingMember: true, promoteMemberError: ''});
    return await http.post<APIResponse<Board>>(`/v1/boards/${boardId}/members/${memberId}/promote`)
      .then(apiResponse => {
        if (apiResponse.success) return apiResponse.data;
        throw new Error(apiResponse.message);
      })
      .catch((e: ResponseError<APIResponse<Board>>) => {
        set({promoteMemberError: e.data.message || e.message || "Failed to promote member. Try again later." });
        return null;
      })
      .finally(() => {
        set({ isPromotingMember: false });
      });
  },

  // Reset all errors
  resetBoardErrors: () => {
    set({
      leaveBoardError: "",
      removeMemberError: "",
      promoteMemberError: "",
      createBoardError: "",
      loadBoardError: "",
      loadBoardsError: "",
      addMemberError: ""
    });
  }
}));

export default useBoardStore;