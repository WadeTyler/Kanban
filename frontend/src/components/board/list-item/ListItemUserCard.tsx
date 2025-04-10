import React from 'react';
import {User} from "@/types/auth.types";

const ListItemUserCard = ({user, cn}: {
  user: User;
  cn?: string;
}) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-md hover:bg-accent/20 cursor-pointer duration-200 ${cn}`}>
      <img src={user.profilePicture} alt={`${user.name}'s Profile Picture`} className="w-6 h-6 rounded-full object-cover object-center overflow-hidden" />
      <span>{user.name.length > 20 ? user.name.substring(0, 17) + "..." : user.name}</span>
    </div>
  );
};

export default ListItemUserCard;