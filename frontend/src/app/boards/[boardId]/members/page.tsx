'use client';
import React, {FormEvent, useEffect, useState} from 'react';
import useBoardStore from "@/stores/board.store";
import useAuthStore from "@/stores/auth.store";
import AuthProvider from "@/providers/AuthProvider";
import {useParams} from "next/navigation";
import {Board} from "@/types/board.types";
import LoadingScreen from "@/components/LoadingScreen";
import {
  RiArrowLeftLongLine,
  RiUserAddLine,
} from "@remixicon/react";
import Label from "@/components/Label";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import MembersUserCard from "@/components/members-page/MembersUserCard";
import MembersHeader from "@/components/members-page/MembersHeader";

const Page = () => {
  // Nav
  const params = useParams<{ boardId: string; }>()
  const boardId = params.boardId;

  // States
  const [board, setBoard] = useState<Board | null>(null);
  const [isBoardOwner, setIsBoardOwner] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Store
  const {
    loadBoard,
    isLoadingBoard,
    loadBoardError,
    addMember,
    isAddingMember,
    addMemberError,
    removeMember,
    isRemovingMember,
    removeMemberError,
    resetBoardErrors,
    isPromotingMember,
    promoteMember
  } = useBoardStore();
  const {user} = useAuthStore();

  // Load board
  useEffect(() => {
    resetBoardErrors();
    if (boardId && user) {
      setBoard(null);
      loadBoard(boardId).then(board => {
        if (board) {
          setBoard(board);
          setIsBoardOwner(board.owner.userId === user.userId);
          console.log(board);
        }
      }).catch(() => {
        setBoard(null);
        setIsBoardOwner(false);
      })
    }

  }, [user, boardId]);

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();

    if (!newMemberEmail || isAddingMember) return;

    // Add member
    await addMember(boardId, newMemberEmail)
      .then((members) => {
        if (members && board) {
          setBoard({
            ...board,
            members: members
          });
          setNewMemberEmail('');
        }
      })
  }

  const handleRemoveMember = async (memberId: string) => {
    if (isRemovingMember || !board || !user || !isBoardOwner) return;
    // Remove Member
    removeMember(board.boardId, memberId)
      .then((members) => {
        if (members) {
          setBoard({
            ...board,
            members: members
          });
        }
      })
  }

  const handlePromoteMember = async (memberId: string) => {
    if (isPromotingMember || !board || !user || !isBoardOwner) return;
    // Promote Member
    promoteMember(board.boardId, memberId)
      .then((board) => {
        if (board) {
          setBoard(board);
          setIsBoardOwner(false);
        }
      })
  }

  if (!board && isLoadingBoard) {
    return <LoadingScreen/>
  }

  return (
    <AuthProvider authRequired={true}>
      <div className="page-padding w-full min-h-screen flex flex-col items-center gap-4">
        <div className="max-w-[55rem] w-full flex flex-col items-center gap-4 relative">


          <Link href={`/boards/${boardId}`} className="absolute top-0 left-0 submit-btn">
            <RiArrowLeftLongLine/>
            Back
          </Link>

          <MembersHeader boardOwner={isBoardOwner}/>

          <hr className="w-full text-secondary"/>

          {loadBoardError && (
            <div className="w-full flex items-center justify-center">
              <span className="text-danger text-lg font-semibold">{loadBoardError}</span>
            </div>
          )}

          {board && user && (
            <div className="w-full flex flex-col items-center gap-4 relative">

              {isBoardOwner && (
                <form className="max-w-96 w-full flex flex-col items-center gap-4" onSubmit={handleAddMember}>
                  <div className="w-full flex items-center gap-2 h-12">
                    <input type="text" className="input-bar h-full"
                           placeholder="Add a member by email (johndoe@gmail.com)" value={newMemberEmail}
                           onChange={(e) => setNewMemberEmail(e.target.value)}/>
                    <button className="submit-btn h-full group relative" disabled={isAddingMember}>
                      {!isAddingMember
                        ? (
                          <>
                            <RiUserAddLine/>
                            <Label text="Add Member"/>
                          </>
                        )
                        : (
                          <>
                            <LoadingSpinner/>
                            <Label text="Adding Member"/>
                          </>
                        )
                      }
                    </button>
                  </div>

                  {addMemberError && <span className="text-danger text-sm text-center">{addMemberError}</span>}
                </form>
              )}


              {board.members.map((member) => (
                <MembersUserCard
                  key={member.userId}
                  member={member}
                  isBoardOwner={isBoardOwner}
                  boardOwner={board.owner}
                  handleRemoveMember={handleRemoveMember} handlePromoteMember={handlePromoteMember}
                />
              ))}
            </div>
          )}
        </div>

        {removeMemberError && (
          <span
            className="fixed bottom-4 left-1/2 -translate-x-1/2 p-2 bg-danger text-white rounded-md z-40">{removeMemberError}</span>
        )}
      </div>
    </AuthProvider>
  );
};

export default Page;

