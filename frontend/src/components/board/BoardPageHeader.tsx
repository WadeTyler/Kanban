import React, {SetStateAction} from 'react';
import ConnectedUsers from "@/components/board/ConnectedUsers";
import {RiSettings2Line} from "@remixicon/react";
import Label from "@/components/Label";
import BoardSettings from "@/components/board/BoardSettings";
import {Board} from "@/types/board.types";
import {useWebSocketStore} from "@/stores/websocket.store";

const BoardPageHeader = ({board, isShowingSettings, setIsShowingSettings, setIsEditingStatusTypes}: {
  board: Board;
  isShowingSettings: boolean;
  setIsShowingSettings: React.Dispatch<SetStateAction<boolean>>;
  setIsEditingStatusTypes: React.Dispatch<SetStateAction<boolean>>;
}) => {

  const {connectedUsers} = useWebSocketStore();

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <h1 className="text-xl font-semibold text-accent">{board.name}</h1>
      {/* Action Btns */}
      <div className="flex items-center gap-4">

        <ConnectedUsers connectedUsers={connectedUsers} boardOwner={board.owner}/>

        <div className="relative group h-fit">
          <RiSettings2Line className="hover-btn size-8"
                           onClick={() => setIsShowingSettings((prev: boolean) => !prev)}/>
          {!isShowingSettings && <Label text={"Settings"}/>}
          {isShowingSettings && board && (
            <BoardSettings board={board} editStatusTypes={() => setIsEditingStatusTypes(true)} closeSettings={() => setIsShowingSettings(false)}/>)
          }
        </div>

      </div>
    </div>
  );
};

export default BoardPageHeader;