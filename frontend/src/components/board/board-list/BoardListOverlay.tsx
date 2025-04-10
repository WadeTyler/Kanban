import {BoardList as BoardListType} from "@/types/board.types";
import ListItem from "@/components/board/list-item/ListItem";
import CreateNewListItem from "@/components/board/list-item/CreateNewListItem";
import React from "react";

export const BoardListOverlay = ({boardList}: {
  boardList: BoardListType;
}) => {
  return (
    <div
      className="min-w-72 min-h-24 h-fit max-h-full flex bg-secondary-dark opacity-50 flex-col p-2 gap-4 shadow-xl hover:shadow-2xl rounded-md border-secondary-dark border hover:border-accent duration-200 ">

      <div className="cursor-pointer">
        <h2 className="text-white font-semibold text-lg">{boardList.name}</h2>
      </div>

      {boardList.listItems?.sort((a, b) => a.position - b.position)
        .map((listItem) => (
          <ListItem key={listItem.listItemId} listItem={listItem}/>
        ))}

      <CreateNewListItem boardList={boardList}/>

    </div>
  )
}

export default BoardListOverlay;