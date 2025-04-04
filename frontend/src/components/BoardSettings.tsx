import React, {SetStateAction} from 'react';
import {Board} from "@/types/board.types";
import {RiUserLine} from "@remixicon/react";
import Link from "next/link";

const BoardSettings = ({board, setBoard}: {
  board: Board;
  setBoard: React.Dispatch<SetStateAction<Board | null>>;
}) => {
  return (
    <div className="absolute bg-secondary-dark w-fit h-96 right-0 top-full mt-2 rounded-md shadow-xl text-white p-4 duration-200 border border-transparent hover:border-accent">
      <Link href={`/boards/${board.boardId}/members`} className="hover-btn2"><RiUserLine/>Members</Link>
      
    </div>
  );
};

export default BoardSettings;