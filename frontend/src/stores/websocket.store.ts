import {create} from 'zustand';
import {Client} from "@stomp/stompjs";
import {BROKER_URL} from "@/environment";
import {BoardList} from "@/types/board.types";
import {User} from "@/types/auth.types";

interface WebSocketStore {
  boardId: string | null;
  setBoardId: (boardId: string | null) => void;

  client: Client;
  connectToBoard: (boardId: string) => void;
  disconnectFromBoard: (boardId: string) => void;
  connectedUsers: User[];

  // Handling new Boards
  isCreatingNewBoardList: boolean;
  newBoardList: BoardList | null;
  resetNewBoardList: () => void;
  createBoardList: (name: string) => void;
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

  connectToBoard: (boardId: string) => {
    const client = get().client;

    client.onConnect = function (frame) {
      announceConnected(client, boardId);

      // Subscribe to connected users
      client.subscribe(`/topic/boards/${boardId}/connectedUsers`, (message) => {
        const connectedUsers = JSON.parse(message.body);
        if (connectedUsers) {
          console.log("Connected users: ", connectedUsers);
          set({ connectedUsers: connectedUsers });
        }
      })

      // Subscribe to receiving new board lists
      client.subscribe(`/topic/boards/${boardId}/lists/new`, (message) => {
        const newBoardList = JSON.parse(message.body);
        if (newBoardList) {
          console.log("New board list received: ", newBoardList);
          set({ newBoardList: newBoardList });
        }

        if (get().isCreatingNewBoardList) {
          set({ isCreatingNewBoardList: false });
        }
      })
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

  ///////////////////////////// NEW BOARD LISTS /////////////////////////////

  isCreatingNewBoardList: false,
  // Used to receive new board lists
  newBoardList: null,
  resetNewBoardList: () => {
    set({ newBoardList: null });
  },

  // Create a new board list and publish to web socket
  createBoardList: (name: string) => {
    const boardId = get().boardId;
    if (!boardId || get().isCreatingNewBoardList) return;

    set({ isCreatingNewBoardList: true });

    const client = get().client;

    client.publish({
      destination: `/app/boards/${boardId}/lists/create`,
      body: JSON.stringify({ name })
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
