'use client';
import React, {useEffect, useState} from 'react';
import useBoardStore from "@/stores/board.store";
import useAuthStore from "@/stores/auth.store";
import {Board} from "@/types/board.types";
import {useParams} from "next/navigation";
import AuthProvider from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import {RiSettings2Line} from "@remixicon/react";
import Label from "@/components/Label";
import {BoardList, CreateNewBoardList} from "@/components/BoardList";
import {useWebSocketStore} from "@/stores/websocket.store";
import ConnectedUsers from "@/components/ConnectedUsers";
import BoardSettings from "@/components/BoardSettings";

const Page = () => {
  // Nav
  const params = useParams<{ boardId: string; }>()
  const boardId = params.boardId;

  // States
  const [board, setBoard] = useState<Board | null>(null);
  const [isShowingSettings, setIsShowingSettings] = useState<boolean>(false);

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
    resetUpdatedBoardList
  } = useWebSocketStore();


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
      })
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

      setBoard(newBoard);
      resetUpdatedBoardList();
    }

  }, [updatedBoardList]);

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
            <header className="flex items-center justify-between gap-4 w-full">
              <h1 className="text-xl font-semibold text-accent">{board.name}</h1>
              {/* Action Btns */}
              <div className="flex items-center gap-4">

                <ConnectedUsers connectedUsers={connectedUsers}/>

                <button className="relative group h-fit" >
                  <RiSettings2Line className="hover-btn size-8" onClick={() => setIsShowingSettings(prev => !prev)}/>
                  {!isShowingSettings && <Label text={"Settings"}/>}
                  {isShowingSettings && board && (
                    <BoardSettings board={board} setBoard={setBoard} />)
                  }
                </button>

              </div>
            </header>
            <hr className="border w-full border-secondary"/>
            <div className="w-full h-full flex gap-8 overflow-x-scroll overflow-y-hidden">
              {board.lists?.map((boardList) => (
                <BoardList boardList={boardList} key={boardList.boardListId} board={board}/>
              ))}
              <CreateNewBoardList/>
            </div>

          </div>
        )}
      </div>



    </AuthProvider>
  );
};

export default Page;