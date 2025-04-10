import React from "react";

function MembersHeader(props: { boardOwner: boolean }) {
  return <header className="flex flex-col items-center gap-2 w-full">
    <h1 className="text-3xl font-bold text-accent">Board Members</h1>
    {props.boardOwner
      ? <span className="text-secondary text-lg">Manage the members of your board.</span>
      : <span className="text-secondary text-lg">View the members of this board.</span>
    }
  </header>;
}

export default MembersHeader;