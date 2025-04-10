import {create} from 'zustand';
import {Client} from "@stomp/stompjs";
import {BROKER_URL} from "@/environment";
import {Board, BoardList, CreateUpdateStatusTypeRequest, UpdateListItemRequest} from "@/types/board.types";
import {User} from "@/types/auth.types";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

interface WebSocketStore {
  boardId: string | null;
  setBoardId: (boardId: string | null) => void;

  client: Client;
  connectToBoard: (boardId: string, router: AppRouterInstance) => void;
  disconnectFromBoard: (boardId: string) => void;
  connectedUsers: User[];

  isPending: boolean;
  webSocketErrorMessage: string | null;
  resetWebSocketErrorMessage: () => void;

  // Handling updating board
  updatedBoard: Board | null;
  resetUpdatedBoard: () => void;
  createStatusType: (createStatusTypeRequest: CreateUpdateStatusTypeRequest) => Promise<void>;
  deleteStatusType: (statusTypeId: number) => Promise<void>;
  updateStatusType: (statusTypeId: number, updateStatusTypeRequest: CreateUpdateStatusTypeRequest) => Promise<void>;

  // Handling new Board lists
  newBoardList: BoardList | null;
  resetNewBoardList: () => void;
  createBoardList: (name: string) => void;

  // Handling updating all board lists
  updatedBoardLists: BoardList[] | null;
  resetUpdatedBoardLists: () => void;
  updateAllBoardLists: (updatedBoardLists: BoardList[]) => void;

  // Handling updating board lists
  updatedBoardList: BoardList | null;
  resetUpdatedBoardList: () => void;

  createListItem: (title: string, listId: number) => Promise<void>;
  updateListItem: (updateListItemRequest: UpdateListItemRequest, listId: number, listItemId: number) => Promise<void>;
  deleteListItem: (listId: number, listItemId: number) => Promise<void>;

  deleteBoard: () => void;
}
export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  boardId: null,
  setBoardId: (boardId: string | null) => {
    set({ boardId });
  },

  client: new Client({
    brokerURL: BROKER_URL,
    debug: function (str) {
      console.log("WebSocket Debug: " + str);
    },
    reconnectDelay: 3000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    maxReconnectDelay: 15000
  }),

  connectedUsers: [],

  isPending: false,
  webSocketErrorMessage: null,
  resetWebSocketErrorMessage: () => {
    set({ webSocketErrorMessage: null });
  },

  connectToBoard: (boardId: string, router: AppRouterInstance) => {
    const client = get().client;

    client.onConnect = function () {
      announceConnected(client, boardId);

      // Subscribe to errors
      client.subscribe(`/user/queue/errors`, (message) => {
        set({ webSocketErrorMessage: message.body });
        if (get().isPending) {
          set({ isPending: false });
        }
      });

      // Subscribe to connected users
      client.subscribe(`/topic/boards/${boardId}/connectedUsers`, (message) => {
        const connectedUsers = JSON.parse(message.body);
        if (connectedUsers) {
          console.log("Connected users: ", connectedUsers);
          set({ connectedUsers: connectedUsers });
        }
      });

      // Handle updated boards
      client.subscribe(`/topic/boards/${boardId}/updated`, (message) => {
        const updatedBoard: Board = JSON.parse(message.body);
        if (updatedBoard) {
          console.log("Updated board received: ", updatedBoard);
          set({ updatedBoard: updatedBoard });
        }

        if (get().isPending) {
          set({ isPending: false });
        }
      });

      // Subscribe to receiving new board lists
      client.subscribe(`/topic/boards/${boardId}/lists/new`, (message) => {
        const newBoardList: BoardList = JSON.parse(message.body);
        if (newBoardList) {
          console.log("New board list received: ", newBoardList);
          set({ newBoardList: newBoardList });
        }

        if (get().isPending) {
          set({ isPending: false });
        }
      });

      // Subscribe to receiving updated board lists
      client.subscribe(`/topic/boards/${boardId}/lists/updated`, (message) => {
        const updatedBoardList: BoardList = JSON.parse(message.body);
        if (updatedBoardList) {
          console.log("Received Updated board list: ", updatedBoardList);
          set({ updatedBoardList: updatedBoardList });
        }

        if (get().isPending) {
          set({ isPending: false });
        }
      });

      // Subscribe to receiving all updated board lists
      client.subscribe(`/topic/boards/${boardId}/lists/updated/all`, (message) => {
        const updatedBoardLists:BoardList[] = JSON.parse(message.body);
        if (updatedBoardLists) {
          console.log("Received Updated board lists: ", updatedBoardLists);
          set({ updatedBoardLists: updatedBoardLists });
        }
        if (get().isPending) {
          set({ isPending: false });
        }
      });

      client.subscribe(`/topic/boards/${boardId}/deleted`, (message) => {
        if (get().isPending) {
          set({ isPending: false });
        }

        console.log("Board deleted: ", message.body);
        router.push("/boards?boardDeleted=true");
      });

    }

    client.activate();
  },

  disconnectFromBoard: (boardId: string) => {
    const client = get().client;

    if (client.active) {
      client.publish({
        destination: `/app/boards/${boardId}/disconnect`
      });

      set({ connectedUsers: []});

      // Then deactivate
      client.deactivate();
    }
  },

  ///////////////////////////// HANDLING UPDATING BOARD /////////////////////////////

  updatedBoard: null,
  resetUpdatedBoard: () => {
    set({ updatedBoard: null });
  },

  // Create a new status type
  createStatusType: async (createStatusTypeRequest: CreateUpdateStatusTypeRequest) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/status-types/create`,
      body: JSON.stringify(createStatusTypeRequest)
    });
  },

  // Delete a status type
  deleteStatusType: async (statusTypeId: number) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;
    client.publish({
      destination: `/app/boards/${boardId}/status-types/${statusTypeId}/delete`
    })
  },

  updateStatusType: async (statusTypeId: number, updateStatusTypeRequest: CreateUpdateStatusTypeRequest) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;
    client.publish({
      destination: `/app/boards/${boardId}/status-types/${statusTypeId}/update`,
      body: JSON.stringify(updateStatusTypeRequest)
    });
  },

  ///////////////////////////// NEW BOARD LISTS /////////////////////////////

  // Used to receive new board lists
  newBoardList: null,
  resetNewBoardList: () => {
    set({ newBoardList: null });
  },

  // Create a new board list and publish to web socket
  createBoardList: (name: string) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/lists/create`,
      body: JSON.stringify({ name })
    });
  },


  // Handling updating all board lists
  updatedBoardLists: null,
  resetUpdatedBoardLists: () => {
    set({ updatedBoardLists: null });
  },
  updateAllBoardLists: async (updatedBoardLists: BoardList[]) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;
    set({ isPending: true });

    const client = get().client;
    client.publish({
      destination: `/app/boards/${boardId}/lists/update`,
      body: JSON.stringify({updatedBoardLists})
    });
  },
  ///////////////////////////// NEW LIST ITEMS /////////////////////////////

  // Handling new list items
  updatedBoardList: null,
  resetUpdatedBoardList: () => {
    set({ updatedBoardList: null });
  },

  createListItem: async (title: string, listId: number) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/lists/${listId}/items/create`,
      body: JSON.stringify({ title })
    });
  },

  updateListItem: async (updateListItemRequest: UpdateListItemRequest, listId: number, listItemId: number) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/lists/${listId}/items/${listItemId}/update`,
      body: JSON.stringify(updateListItemRequest)
    });
  },

  deleteListItem: async (listId: number, listItemId: number) => {
    const boardId = get().boardId;
    if (!boardId || get().isPending) return;

    set({ isPending: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/lists/${listId}/items/${listItemId}/delete`,
      body: JSON.stringify({})
    });
  },

  deleteBoard: () => {
    const client = get().client;
    const boardId = get().boardId;

    if (!client.active || get().isPending || !boardId) return;

    client.publish({
      destination: `/app/boards/${boardId}/delete`,
      body: JSON.stringify({})
    });
  }
}));


// Subscriptions and publishes
const announceConnected = (client: Client, boardId: string) => {
  // Announce connection to ws
  client.publish({
    destination: `/app/boards/${boardId}/connect`
  });
  console.log("Connected to board: " + boardId);
}
