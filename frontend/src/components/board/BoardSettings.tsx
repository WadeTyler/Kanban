import React, {useState} from 'react';
import {Board} from "@/types/board.types";
import {RiLogoutBoxLine, RiTimelineView, RiUserLine} from "@remixicon/react";
import Link from "next/link";
import useBoardStore from "@/stores/board.store";
import {useRouter} from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuthStore from "@/stores/auth.store";
import ConfirmPanel from "@/components/ConfirmPanel";

const BoardSettings = ({board, editStatusTypes}: {
  board: Board;
  editStatusTypes: () => void;
}) => {

  // Navigation
  const router = useRouter();

  // Stores
  const {leaveBoard, leaveBoardError, isLeavingBoard} = useBoardStore();
  const {user} = useAuthStore();

  // States
  const [isConfirmingLeaveBoard, setIsConfirmingLeaveBoard] = useState<boolean>(false);

  // Functions
  const handleLeaveBoard = async () => {
    if (!board || isLeavingBoard) return;

    await leaveBoard(board.boardId)
      .then(isSuccess => {
        if (isSuccess) {
          setIsConfirmingLeaveBoard(false);
          router.push("/boards");
        }
      });


  }

  return (
    <div
      className="absolute bg-secondary-dark w-flit h-fit right-0 top-full mt-2 rounded-md shadow-xl text-white p-4 duration-200 border border-transparent hover:border-accent flex flex-col gap-2">
      <Link href={`/boards/${board.boardId}/members`} className="hover-btn2 justify-start!"><RiUserLine/>Members</Link>
      <button className="hover-btn2 justify-start!" onClick={editStatusTypes}><RiTimelineView/>Status Types</button>

      <hr className="border border-secondary"/>

      {board.owner.userId !== user?.userId && (
        <button className="hover-btn2 text-danger" disabled={isLeavingBoard} onClick={() => setIsConfirmingLeaveBoard(true)}>
          {!isLeavingBoard
            ?
            <>
              <RiLogoutBoxLine/>
              <span>Leave Board</span>
            </>
            :
            <>
              <LoadingSpinner/>
              <span>Leaving...</span>
            </>
          }
        </button>
      )}

      {isConfirmingLeaveBoard && <ConfirmPanel headerText={"You are about to leave this board."} bodyText={`You are about to leave the board '${board.name}'. Once you leave this board you will no longer be able to access it. Are you sure you want to leave this board?`} confirmFunction={handleLeaveBoard} cancelFunction={() => setIsConfirmingLeaveBoard(false)} isPending={isLeavingBoard} errorMsg={leaveBoardError}/>}

    </div>
  );
};

export default BoardSettings;
