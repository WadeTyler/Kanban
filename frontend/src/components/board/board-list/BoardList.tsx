'use client';
import {BoardList as BoardListType} from "@/types/board.types";
import ListItem from "@/components/board/list-item/ListItem";
import CreateNewListItem from "@/components/board/list-item/CreateNewListItem";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import React, {useState} from "react";
import ScreenPanelOverlay from "@/components/ScreenPanelOverlay";
import EditName from "@/components/board/board-list/EditName";

export const BoardList = ({boardList}: {
  boardList: BoardListType;
}) => {

  const [isShowingContextMenu, setIsShowingContextMenu] = useState(false);
  const [contextClickPos, setContextClickPos] = useState({x: 0, y: 0});
  const [isEditingName, setIsEditingName] = useState(false);

  const toggleContextMenu = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsShowingContextMenu(prev => !prev);
    if ("clientX" in event && "clientY" in event) {
      setContextClickPos({x: event.clientX, y: event.clientY});
    } else {
      setContextClickPos({x: 0, y: 0});
    }
  }

  const handleShowEditingName = () => {
    setIsShowingContextMenu(false);
    setIsEditingName(true);
  }

  const {attributes, listeners, setNodeRef, transition, transform} = useSortable({
    id: boardList.boardListId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      className="min-w-72 w-72 min-h-24 h-fit max-h-full flex flex-col gap-4 bg-secondary-dark shadow-xl hover:shadow-2xl rounded-md border-secondary-dark border hover:border-accent duration-200 overflow-y-scroll overflow-x-hidden relative"
      style={style}
    >

      <div className="cursor-pointer sticky top-0 left-0 w-full h-12 bg-secondary-dark p-4 z-20"
           ref={setNodeRef} {...attributes} {...listeners} onContextMenu={toggleContextMenu}>
        <h2 className="text-white font-semibold text-lg">{boardList.name}</h2>
      </div>

      {isShowingContextMenu && (
        <ClickAwayListener onClickAway={() => setIsShowingContextMenu(false)}>
          <div
            className={`fixed flex items-center justify-center z-40 bg-dark border-accent border text-white rounded-md shadow-xl p-2`}
            style={{
              top: `${contextClickPos.y}px`,
              left: `${contextClickPos.x}px`,
            }}>
            <button className="submit-btn" onClick={handleShowEditingName}>Edit Name</button>
          </div>
        </ClickAwayListener>
      )}

      <div className="flex flex-col gap-4 p-2">
        {boardList.listItems?.sort((a, b) => a.position - b.position)
          .map((listItem) => (
            <ListItem key={listItem.listItemId} listItem={listItem}/>
          ))}

        <CreateNewListItem boardList={boardList}/>
      </div>

      {isEditingName && (
        <ScreenPanelOverlay>
          <EditName currentName={boardList.name} close={() => setIsEditingName(false)}
                    boardListId={boardList.boardListId}/>
        </ScreenPanelOverlay>
      )}

    </div>
  );
};
