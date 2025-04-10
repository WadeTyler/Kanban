import React, {useState} from 'react';
import {Board} from "@/types/board.types";
import {RiDeleteBin3Line, RiEdit2Line, RiLogoutBoxLine, RiTimelineView, RiUserLine} from "@remixicon/react";
import Link from "next/link";
import useBoardStore from "@/stores/board.store";
import {useRouter} from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuthStore from "@/stores/auth.store";
import ConfirmPanel from "@/components/ConfirmPanel";
import {useWebSocketStore} from "@/stores/websocket.store";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const BoardSettings = ({board, editStatusTypes, closeSettings, editBoardDetails}: {
  board: Board;
  editBoardDetails: () => void;
  editStatusTypes: () => void;
  closeSettings: () => void;
}) => {

  // Navigation
  const router = useRouter();

  // Stores
  const {leaveBoard, leaveBoardError, isLeavingBoard} = useBoardStore();
  const {deleteBoard, isPending} = useWebSocketStore();
  const {user} = useAuthStore();

  const isOwner = user?.userId === board.owner.userId;

  // States
  const [isConfirmingLeaveBoard, setIsConfirmingLeaveBoard] = useState<boolean>(false);
  const [isConfirmingDeleteBoard, setIsConfirmingDeleteBoard] = useState<boolean>(false);

  // Functions
  const handleLeaveBoard = async () => {
    if (!board || isLeavingBoard) return;

    await leaveBoard(board.boardId)
      .then(isSuccess => {
        if (isSuccess) {
          setIsConfirmingLeaveBoard(false);
          router.push("/boards");
          closeSettings();
        }
      });
  }

  const handleDeleteBoard = async () => {
    if (!board || isPending) return;
    closeSettings();
    deleteBoard();
  }

  const handleClickEditStatusTypes = () => {
    editStatusTypes();
    closeSettings();
  }

  return (
    <ClickAwayListener onClickAway={closeSettings}>
      <div
        className="absolute bg-secondary-dark w-fit h-fit right-0 top-full mt-2 rounded-md shadow-xl text-white p-4 duration-200 border border-transparent hover:border-accent flex flex-col gap-2 z-40">
        {isOwner && (
          <>
            <button className="hover-btn2 justify-start!" onClick={editBoardDetails}>
              <RiEdit2Line/>
              Edit Board Details
            </button>
            <hr className="w-full text-secondary"/>
          </>
        )}

        <Link href={`/boards/${board.boardId}/members`}
              className="hover-btn2 justify-start!"><RiUserLine/>Members</Link>
        <button className="hover-btn2 justify-start!" onClick={handleClickEditStatusTypes}><RiTimelineView/>Status Types
        </button>

        <hr className="text-secondary w-full"/>

        {!isOwner && (
          <button className="danger-btn whitespace-nowrap border-white! hover:border-danger!" disabled={isLeavingBoard}
                  onClick={() => setIsConfirmingLeaveBoard(true)}>
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

        {isOwner && (
          <button className="danger-btn whitespace-nowrap border-white! hover:border-danger!"
                  onClick={() => setIsConfirmingDeleteBoard(true)}>
            {!isPending ? (
              <>
                <RiDeleteBin3Line/>
                Delete Board
              </>
            ) : (
              <>
                <LoadingSpinner/>
                <span>Deleting...</span>
              </>
            )}
          </button>
        )}

        {isConfirmingLeaveBoard &&
          <ConfirmPanel
            headerText={"You are about to leave this board."}
            bodyText={`You are about to leave the board '${board.name}'. Once you leave this board you will no longer be able to access it. Are you sure you want to leave this board?`}
            confirmFunction={handleLeaveBoard}
            cancelFunction={() => setIsConfirmingLeaveBoard(false)}
            isPending={isLeavingBoard} errorMsg={leaveBoardError}
          />
        }

        {isConfirmingDeleteBoard &&
          <ConfirmPanel
            headerText={"You are about to delete this board."}
            bodyText={`You are about to delete the board '${board.name}'. All data on this board will be permanently deleted. This action is irreversible. Are you sure you want to do this?`}
            confirmFunction={handleDeleteBoard} cancelFunction={() => setIsConfirmingDeleteBoard(false)}
          />
        }

      </div>
    </ClickAwayListener>
  );
};

export default BoardSettings;
