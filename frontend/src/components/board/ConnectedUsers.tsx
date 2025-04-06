import React from 'react';
import {User} from "@/types/auth.types";
import Label from "@/components/Label";
import {RiShieldUserLine} from "@remixicon/react";

const ConnectedUsers = ({connectedUsers, boardOwner}: {
  connectedUsers: User[];
  boardOwner: User;
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {connectedUsers.map((user) => (
        <div key={user.userId} className="group relative">
          <img src={user.profilePicture} alt={`${user.name}'s Profile Picture`}
               className="size-8 rounded-full object-center object-cover"/>
          {user.userId === boardOwner.userId && (
            <div
              className={`absolute -bottom-1 -right-1 bg-secondary-dark rounded-full text-accent text-xs flex items-center justify-center size-4`}>
              <RiShieldUserLine/>
            </div>
          )}
          <Label text={`${user.name}${user.userId === boardOwner.userId ? ' - (Owner)' : ''}`}/>
        </div>
      ))}

    </div>
  );
};

export default ConnectedUsers;