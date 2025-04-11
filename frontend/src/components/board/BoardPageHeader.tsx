import React, {SetStateAction} from 'react';
import ConnectedUsers from "@/components/board/ConnectedUsers";
import {RiEdit2Line, RiSettings2Line} from "@remixicon/react";
import Label from "@/components/Label";
import BoardSettings from "@/components/board/BoardSettings";
import {Board} from "@/types/board.types";
import {useWebSocketStore} from "@/stores/websocket.store";

const BoardPageHeader = ({
                           board,
                           isShowingSettings,
                           setIsShowingSettings,
                           setIsEditingStatusTypes,
                           setIsEditingBoardDetails
                         }: {
  board: Board;
  isShowingSettings: boolean;
  setIsShowingSettings: React.Dispatch<SetStateAction<boolean>>;
  setIsEditingStatusTypes: React.Dispatch<SetStateAction<boolean>>;
  setIsEditingBoardDetails: React.Dispatch<SetStateAction<boolean>>;
}) => {

  const {connectedUsers} = useWebSocketStore();

  return (
    <div className="flex items-center justify-between gap-4 w-full bg-black/50 p-4 rounded-md">
      <div className="flex items-center gap-4 relative group">
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-semibold text-accent">{board.name}</h1>
          <div className="text-xs text-secondary-dark group relative">
            <span>{board.description && board.description.length > 80 ? board.description.substring(0, 77) + "..." : board.description ? board.description : "No Description"}</span>
          </div>
        </div>

        <RiEdit2Line className="hover-btn size-8 hidden! group-hover:flex! duration-200"
                     onClick={() => setIsEditingBoardDetails(true)}/>

      </div>
      {/* Action Btns */}
      <div className="flex items-center gap-4">

        <ConnectedUsers connectedUsers={connectedUsers} boardOwner={board.owner}/>

        <div className="relative group h-fit">
          <RiSettings2Line className="hover-btn size-8"
                           onClick={() => setIsShowingSettings((prev: boolean) => !prev)}/>
          {!isShowingSettings && <Label text={"Settings"}/>}
          {isShowingSettings && board && (
            <BoardSettings
              board={board}
              editStatusTypes={() => {
                setIsEditingStatusTypes(true);
                setIsShowingSettings(false);
              }}
              editBoardDetails={() => {
                setIsEditingBoardDetails(true);
                setIsShowingSettings(false);
              }}
              closeSettings={() => setIsShowingSettings(false)}
            />
          )
          }
        </div>

      </div>
    </div>
  );
};

export default BoardPageHeader;