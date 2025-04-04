import React from 'react';
import {User} from "@/types/auth.types";
import Label from "@/components/Label";

const ConnectedUsers = ({connectedUsers}: {
  connectedUsers: User[];
}) => {
  return (
    <div className="flex items-center justify-center gap-4 h-16">
      <span className="text-foreground">Connected Users:</span>

      {connectedUsers.map((user) => (
        <div key={user.userId} className="group relative">
          <img src={user.profilePicture} alt={`${user.name}'s Profile Picture`} className="w-8 h-8 rounded-full object-center object-cover"/>
          <Label text={`${user.name}`}/>
        </div>
      ))}

    </div>
  );
};

export default ConnectedUsers;