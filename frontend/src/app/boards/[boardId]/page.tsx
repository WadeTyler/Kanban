'use client';
import React, {useEffect, useState} from 'react';
import useBoardStore from "@/stores/board.store";
import useAuthStore from "@/stores/auth.store";
import {Board, BoardList as BoardList_Type} from "@/types/board.types";
import {useParams} from "next/navigation";
import AuthProvider from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import {RiSettings2Line} from "@remixicon/react";
import Label from "@/components/Label";
import {BoardList, BoardListOverlay, CreateNewBoardList} from "@/components/board/BoardList";
import {useWebSocketStore} from "@/stores/websocket.store";
import ConnectedUsers from "@/components/board/ConnectedUsers";
import BoardSettings from "@/components/board/BoardSettings";
import {useBoardUIStore} from "@/stores/board-ui.store";
import ScreenPanelOverlay from "@/components/ScreenPanelOverlay";
import ListItemSettings from "@/components/board/list-item/ListItemSettings";
import EditStatusTypes from "@/components/board/EditStatusTypes";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";

const Page = () => {
  // Nav
  const params = useParams<{ boardId: string; }>()
  const boardId = params.boardId;

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
    connectedUsers,
    updatedBoardList,
    resetUpdatedBoardList,
    updatedBoard,
    resetUpdatedBoard,
    updatedBoardLists,
    updateAllBoardLists,
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
          console.log(board);
          connectToBoard(board.boardId);
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
        console.log("Page is being closed, disconnecting from board");
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
      console.log("New board list added: ", newBoard);
      resetNewBoardList();
    }
  }, [newBoardList]);

  // Handle boardlist updates
  useEffect(() => {
    if (updatedBoardList && board) {
      console.log("Updating board list");
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
      console.log("Updated board received: ", updatedBoard);
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
        console.log("here");
        return prevBoard;
      });
      resetUpdatedBoardLists();
      console.log("Updated board lists received: ", updatedBoardLists);
    }
  }, [updatedBoardLists]);

  useEffect(() => {
    console.log("Board: ", board);
  }, [board]);

  ////////////////////////// DRAGGABLE //////////////////////////

  const [activeBoardList, setActiveBoardList] = useState<BoardList_Type | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveBoardList(board?.lists?.find(list => list.boardListId === event.active.id) || null);
  }

  const handleDragEnd = (event: any) => {

    const {active, over} = event;

    if (active.id !== over.id && board?.lists) {
      const boardLists = board.lists;

      const oldIndex = boardLists.indexOf(boardLists.find(list => list.boardListId === active.id) as BoardList_Type);
      const newIndex = boardLists.indexOf(boardLists.find(list => list.boardListId === over.id) as BoardList_Type);

      // Move the list
      const updatedBoardLists: BoardList_Type[] = arrayMove<BoardList_Type>(boardLists, oldIndex, newIndex).map((list, index) => {
        return {
          ...list,
          position: index,  // Update the position of each list
        }
      });

      setBoard({
        ...board,
        lists: updatedBoardLists
      });

      setActiveBoardList(null);

      // Send the updated board list to the server
      updateAllBoardLists(updatedBoardLists);
    }
  }

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-screen page-padding">
          {loadBoardError && <p className="text-danger text-center">{loadBoardError}</p>}

          {board && (
            <div className="w-full h-full flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 w-full">
                <h1 className="text-xl font-semibold text-accent">{board.name}</h1>
                {/* Action Btns */}
                <div className="flex items-center gap-4">

                  <ConnectedUsers connectedUsers={connectedUsers} boardOwner={board.owner}/>

                  <div className="relative group h-fit">
                    <RiSettings2Line className="hover-btn size-8"
                                     onClick={() => setIsShowingSettings(prev => !prev)}/>
                    {!isShowingSettings && <Label text={"Settings"}/>}
                    {isShowingSettings && board && (
                      <BoardSettings board={board} editStatusTypes={() => setIsEditingStatusTypes(true)}/>)
                    }
                  </div>

                </div>
              </div>
              <hr className="text-secondary"/>
              <div className="w-full h-full flex gap-8 overflow-x-scroll overflow-y-hidden">
                {board.lists && (
                  <SortableContext
                    items={board.lists?.map(list => (list.boardListId))}
                    strategy={horizontalListSortingStrategy}
                  >
                    {board.lists?.sort((a, b) => a.position - b.position)
                      .map((boardList) => (
                        <BoardList boardList={boardList} key={boardList.boardListId}/>
                      ))}
                  </SortableContext>
                )}
                <DragOverlay dropAnimation={{
                  duration: 300,
                  easing: 'cubic-bezier(0.2, 0, 0, 1)',
                }}>
                  {activeBoardList && (
                    <BoardListOverlay boardList={activeBoardList}/>
                  )}
                </DragOverlay>
                <CreateNewBoardList/>
              </div>


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
      </DndContext>
    </AuthProvider>
  )
};

export default Page;