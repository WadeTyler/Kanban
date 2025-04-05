'use client'
import React from 'react';
import {RiAddLine} from "@remixicon/react";
import Link from "next/link";
import {Board} from "@/types/board.types";

export const BoardThumbnail = ({board}: {
  board: Board;
}) => {

  return (
    <Link href={`/boards/${board.boardId}`} className="w-full h-full border-secondary hover:border-accent border rounded-md flex flex-col items-center justify-center aspect-video text-foreground hover:text-accent text-lg cursor-pointer hover:bg-accent/10 transition-all duration-200 relative">
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-dark to-transparent h-1/2 rounded-md z-10 flex items-end p-2">
        <p className="text-start z-20 text-white">{board.name}</p>
      </div>
    </Link>
  );
};

export const CreateBoardThumbnail = () => {
  return (
    <Link href={"/boards/create"}
          className="w-full h-full border-accent border rounded-md flex flex-col items-center justify-center aspect-video text-accent text-lg cursor-pointer hover:bg-accent/10 transition-all duration-200">
      <RiAddLine className="size-12"/>
      <p>Create new Board</p>
    </Link>
  )
}
