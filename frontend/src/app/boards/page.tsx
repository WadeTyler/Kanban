'use client';
import React, {useEffect, useState} from 'react';
import AuthProvider from "@/providers/AuthProvider";
import {BoardThumbnail, CreateBoardThumbnail} from "@/components/board/BoardThumbnails";
import useBoardStore from "@/stores/board.store";
import {Board} from "@/types/board.types";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuthStore from "@/stores/auth.store";

const Page = () => {

  const [boards, setBoards] = useState<Board[]>([]);
  const {loadBoards, isLoadingBoards, loadBoardsError} = useBoardStore();
  const {user} = useAuthStore();

  useEffect(() => {
    if (!isLoadingBoards && user) {
      loadBoards().then((boards) => {
        if (boards) {
          setBoards(boards);
        } else {
          setBoards([]);
        }
      });
    }
  }, [user]);

  return (
    <AuthProvider authRequired={true}>
      <div className="w-full page-padding flex flex-col items-center">

        {/* Container */}
        <div className="w-full max-w-[55rem] flex flex-col items-center gap-4">

          <header className="flex flex-col items-center w-full gap-1">
            <h1 className="text-accent text-3xl font-semibold">Kanban Boards</h1>
            <h2 className="text-secondary text-lg">Here are your current Kanban boards!</h2>
          </header>

          <hr className="border w-full border-secondary"/>

          {loadBoardsError && (
            <p className="text-danger text-sm text-center">
              {loadBoardsError}
            </p>
          )}

          {isLoadingBoards && (
            <div className="w-full flex items-center justify-center">
              <LoadingSpinner cn={"size-16 text-accent"} />
            </div>
          )}

          {!isLoadingBoards && (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {boards.map((board) => (
                <BoardThumbnail key={board.boardId} board={board} />
              ))}
              <CreateBoardThumbnail />
            </div>
          )}

        </div>

      </div>
    </AuthProvider>
  );
};

export default Page;