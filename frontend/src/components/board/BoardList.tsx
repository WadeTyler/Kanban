'use client';
import React, {FormEvent, useState} from 'react';
import {RiAddLine} from "@remixicon/react";
import {useWebSocketStore} from "@/stores/websocket.store";
import {BoardList as BoardListType} from "@/types/board.types";
import LoadingSpinner from "@/components/LoadingSpinner";
import ListItem from "@/components/board/list-item/ListItem";
import CreateNewListItem from "@/components/board/list-item/CreateNewListItem";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const BoardList = ({boardList}: {
  boardList: BoardListType;
}) => {


  const {attributes, listeners, setNodeRef, transition, transform} = useSortable({
    id: boardList.boardListId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      className="min-w-72 min-h-24 h-fit max-h-full flex flex-col p-2 gap-4 bg-secondary-dark shadow-xl hover:shadow-2xl rounded-md border-secondary-dark border hover:border-accent duration-200 " style={style}>

      <div className="cursor-pointer" ref={setNodeRef} {...attributes} {...listeners}>
        <h2 className="text-white font-semibold text-lg">{boardList.name}</h2>
      </div>

      {boardList.listItems?.sort((a, b) => a.position - b.position)
        .map((listItem) => (
          <ListItem key={listItem.listItemId} listItem={listItem}/>
        ))}

      <CreateNewListItem boardList={boardList}/>

    </div>
  );
};

export const CreateNewBoardList = () => {

  // Store
  const {createBoardList, isCreatingNewBoardList} = useWebSocketStore();

  // States
  const [listName, setListName] = useState("");

  // Handle Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!listName || isCreatingNewBoardList) return;

    // Create new board list
    createBoardList(listName);
  }

  return (
    <div
      className="min-w-72 w-72 min-h-24 h-fit flex flex-col p-2 items-center justify-center border-accent border rounded-md text-accent">
      <span className="text-sm font-semibold">Add new List</span>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 w-full">
          <input type="text" required value={listName} className="input-bar" placeholder="Enter new list name"
                 onChange={(e) => setListName(e.target.value)}/>
          <button className="submit-btn h-full">
            {!isCreatingNewBoardList
              ? <RiAddLine/>
              : <LoadingSpinner/>
            }
          </button>
        </div>
      </form>
    </div>
  )
}

export const BoardListOverlay = ({boardList}: {
  boardList: BoardListType;
}) => {
  return (
    <div
      className="min-w-72 min-h-24 h-fit max-h-full flex bg-secondary-dark opacity-50 flex-col p-2 gap-4 shadow-xl hover:shadow-2xl rounded-md border-secondary-dark border hover:border-accent duration-200 ">

      <div className="bg-green-500 cursor-pointer">
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