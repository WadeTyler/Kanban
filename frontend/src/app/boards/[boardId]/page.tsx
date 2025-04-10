'use client';
import React, {useEffect, useState} from 'react';
import useBoardStore from "@/stores/board.store";
import useAuthStore from "@/stores/auth.store";
import {Board} from "@/types/board.types";
import {useParams, useRouter} from "next/navigation";
import AuthProvider from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import {useWebSocketStore} from "@/stores/websocket.store";
import {useBoardUIStore} from "@/stores/board-ui.store";
import ScreenPanelOverlay from "@/components/ScreenPanelOverlay";
import ListItemSettings from "@/components/board/list-item/settings/ListItemSettings";
import EditStatusTypes from "@/components/board/EditStatusTypes";
import BoardPageHeader from "@/components/board/BoardPageHeader";
import BoardLists from "@/components/board/board-list/BoardLists";

const Page = () => {
  // Nav
  const params = useParams<{ boardId: string; }>()
  const boardId = params.boardId;
  const router = useRouter();

  // States
  const [board, setBoard] = useState<Board | null>(null);
  const [isShowingSettings, setIsShowingSettings] = useState<boolean>(false);
  const [isEditingStatusTypes, setIsEditingStatusTypes] = useState<boolean>(false);

  // Store
  const {loadBoard, isLoadingBoard, loadBoardError} = useBoardStore();
  const {user} = useAuthStore();
  const {
    setBoardId,
    connectToBoard,
    disconnectFromBoard,
    newBoardList,
    resetNewBoardList,
    updatedBoardList,
    resetUpdatedBoardList,
    updatedBoard,
    resetUpdatedBoard,
    updatedBoardLists,
    resetUpdatedBoardLists
  } = useWebSocketStore();

  const {resetBoardUI, focusedListItem, setFocusedListItem} = useBoardUIStore();

  // Load board and connect to websocket
  useEffect(() => {
    if (boardId && user) {
      disconnectFromBoard(boardId);
      loadBoard(boardId).then(board => {
        if (board) {
          setBoard(board);
          setBoardId(boardId);
          connectToBoard(board.boardId, router);
        }
      }).catch(() => {
        setBoardId(null);
        setBoard(null);
        disconnectFromBoard(boardId);
      });

      resetBoardUI();
    }

    const handleBeforeUnload = () => {
      if (boardId) {
        disconnectFromBoard(boardId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      setBoardId(null);
      disconnectFromBoard(boardId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [boardId, user]);

  // Handle newBoardList changes
  useEffect(() => {
    if (newBoardList && board) {
      console.log("Updating board");
      const newBoard = board;
      newBoard.lists = board.lists ? [...board.lists, newBoardList] : [newBoardList];
      setBoard(newBoard);
      resetNewBoardList();
    }
  }, [newBoardList]);

  // Handle boardlist updates
  useEffect(() => {
    if (updatedBoardList && board) {
      const newBoard = board;
      if (!newBoard) return;

      newBoard.lists = newBoard?.lists?.map((boardList) => {
        if (boardList.boardListId === updatedBoardList.boardListId) {
          return updatedBoardList;
        } else {
          return boardList;
        }
      });

      // Update focused list item if it is in the updated board list
      if (focusedListItem && focusedListItem.boardListId === updatedBoardList.boardListId) {
        setFocusedListItem(updatedBoardList.listItems.find(item => item.listItemId === focusedListItem.listItemId) || null);
      }

      setBoard(newBoard);
      resetUpdatedBoardList();
    }

  }, [updatedBoardList]);


  // Handle updated board
  useEffect(() => {
    if (updatedBoard && board) {
      setBoard(updatedBoard);
      resetUpdatedBoard();
    }
  }, [updatedBoard]);

  // Handle updated board lists
  useEffect(() => {
    if (updatedBoardLists && board) {
      setBoard(prevBoard => {
        if (prevBoard) return {
          ...prevBoard,
          lists: updatedBoardLists
        }
        return prevBoard;
      });
      resetUpdatedBoardLists();
    }
  }, [updatedBoardLists]);

  ////////////////////////// RETURNS //////////////////////////

  if (isLoadingBoard) {
    return (
      <div className="flex items-center justify-center w-full h-screen fixed top-0 left-0 z-40">
        <LoadingSpinner cn="size-16 text-accent"/>
      </div>
    )
  }

  return (
    <AuthProvider authRequired={true}>

      <div className="w-full h-screen page-padding">
        {loadBoardError && <p className="text-danger text-center">{loadBoardError}</p>}

        {board && (
          <div className="w-full h-full flex flex-col gap-4">

            <BoardPageHeader board={board} isShowingSettings={isShowingSettings}
                             setIsShowingSettings={setIsShowingSettings}
                             setIsEditingStatusTypes={setIsEditingStatusTypes}/>

            <hr className="text-secondary"/>

            <BoardLists board={board} setBoard={setBoard}/>

            {focusedListItem && !isEditingStatusTypes && (
              <ScreenPanelOverlay>
                <ListItemSettings listItem={focusedListItem} closeSettings={() => setFocusedListItem(null)}
                                  board={board}/>
              </ScreenPanelOverlay>
            )}

            {isEditingStatusTypes && (
              <ScreenPanelOverlay>
                <EditStatusTypes statusTypes={board.statusTypes} close={() => setIsEditingStatusTypes(false)}/>
              </ScreenPanelOverlay>
            )}

          </div>
        )}
      </div>
    </AuthProvider>
  )
};

export default Page;