import {User} from "@/types/auth.types";
import React, {useState} from "react";
import useBoardStore from "@/stores/board.store";
import {RiDeleteBack2Line, RiShieldUserLine} from "@remixicon/react";
import Label from "@/components/Label";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmPanel from "@/components/ConfirmPanel";

const MembersUserCard = ({member, isBoardOwner, boardOwner, handleRemoveMember, handlePromoteMember}: {
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

export default MembersUserCard;