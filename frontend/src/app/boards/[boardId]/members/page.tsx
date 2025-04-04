'use client';
import React, {FormEvent, useEffect, useState} from 'react';
import useBoardStore from "@/stores/board.store";
import useAuthStore from "@/stores/auth.store";
import AuthProvider from "@/providers/AuthProvider";
import {useParams} from "next/navigation";
import {Board} from "@/types/board.types";
import LoadingScreen from "@/components/LoadingScreen";
import {User} from "@/types/auth.types";
import {
  RiDeleteBack2Line, RiShieldUserLine, RiUserAddLine,
} from "@remixicon/react";
import Label from "@/components/Label";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmPanel from "@/components/ConfirmPanel";

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
        <div className="max-w-[55rem] w-full flex flex-col items-center gap-4">
          <header className="flex flex-col items-center gap-2 w-full">
            <h1 className="text-3xl font-bold text-accent">Board Members</h1>
            {isBoardOwner
              ? <span className="text-secondary text-lg">Manage the members of your board.</span>
              : <span className="text-secondary text-lg">View the members of this board.</span>
            }
          </header>

          <hr className="border-secondary w-full border"/>

          {loadBoardError && (
            <div className="w-full flex items-center justify-center">
              <span className="text-danger text-lg font-semibold">{loadBoardError}</span>
            </div>
          )}

          {board && user && (
            <div className="w-full flex flex-col items-center gap-4">
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
                <UserCard key={member.userId} member={member} isBoardOwner={isBoardOwner} boardOwner={board.owner}
                          handleRemoveMember={handleRemoveMember} handlePromoteMember={handlePromoteMember} />
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

const UserCard = ({member, isBoardOwner, boardOwner, handleRemoveMember, handlePromoteMember}: {
  member: User;
  isBoardOwner: boolean;
  boardOwner: User;
  handleRemoveMember: (memberId: string) => Promise<void>;
  handlePromoteMember: (memberId: string) => Promise<void>;
}) => {

  const [isHovering, setIsHovering] = useState(false);
  const [isConfirmingPromoteMember, setIsConfirmingPromoteMember] = useState(false);

  const {isRemovingMember, isPromotingMember, promoteMemberError} = useBoardStore();

  const confirmPromoteMember = async () => {
    await handlePromoteMember(member.userId).then(() => {
      setIsConfirmingPromoteMember(false);
    })
  }

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-96 p-2 bg-secondary-dark rounded-md flex items-center gap-4 border border-transparent hover:border-accent duration-200 hover:shadow-md">

      <img src={member.profilePicture} alt={`${member.name}'s Profile Picture`}
           className="w-8 h-8 object-cover object-center rounded-full"/>

      <div className="flex flex-col justify-center text-sm text-white">
        <span>{member.name}</span>
        <span className="text-white/70">{member.email}</span>
      </div>

      {isBoardOwner && isHovering && member.userId !== boardOwner.userId && (
        <div className="flex items-center gap-2 ml-auto">

          <button className={`text-accent cursor-pointer relative hover-btn group`} onClick={() => setIsConfirmingPromoteMember(true)}>
            <RiShieldUserLine />
            <Label text={"Promote to Owner"}/>
          </button>


          <button className={`text-danger cursor-pointer relative hover-btn group`} disabled={isRemovingMember}
                  onClick={() => handleRemoveMember(member.userId)}>
            {!isRemovingMember
              ? <>
                <RiDeleteBack2Line/>
                <Label text="Remove Board Member"/>
              </>
              : <>
                <LoadingSpinner/>
                <Label text="Removing Member"/>
              </>
            }
          </button>


        </div>
      )}
      {member.userId === boardOwner.userId && (
        <div className={`ml-auto text-accent relative group`}>
          <RiShieldUserLine/>
          <Label text="Board Owner"/>
        </div>
      )}

      {isConfirmingPromoteMember && (
        <ConfirmPanel headerText={`You are about to promote someone to the owner of this board.`} bodyText={`You are about to promote '${member.name}' to the owner of this board. This action is irreversible. Are you sure you want to do this?`} confirmFunction={confirmPromoteMember} cancelFunction={() => setIsConfirmingPromoteMember(false)} isPending={isPromotingMember} errorMsg={promoteMemberError} />
      )}
    </div>
  )
}