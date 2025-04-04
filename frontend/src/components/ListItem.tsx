'use client';
import React, {FormEvent, useState} from 'react';
import {BoardList, ListItem as ListItemType} from "@/types/board.types";
import {useWebSocketStore} from "@/stores/websocket.store";

export const ListItem = ({listItem}: {
  listItem: ListItemType;
}) => {
  return (
    <div
      className="w-full flex p-2 bg-background text-foreground rounded-md shadow-sm hover:shadow-md hover:bg-background/80 duration-200 cursor-pointer">
      <h5>{listItem.title}</h5>
    </div>
  );
};

export const CreateNewListItem = ({boardList}: {
  boardList: BoardList;
}) => {

  // States
  const [title, setTitle] = useState<string>("");

  // Stores
  const {isUpdatingBoardList, createListItem} = useWebSocketStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isUpdatingBoardList || !title) return;

    await createListItem(title, boardList.boardListId).then(() => {
      setTitle("");
    })
  }

  return (
    <div className="w-full flex flex-col gap-2">

      <form onSubmit={handleSubmit}>
        <input type="text" className="input-bar border-accent!" disabled={isUpdatingBoardList} placeholder="Create new Item"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
        />
      </form>

    </div>
  )
}