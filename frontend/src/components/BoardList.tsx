'use client';
import React, {FormEvent, useState} from 'react';
import {RiAddLine} from "@remixicon/react";
import {useWebSocketStore} from "@/stores/websocket.store";
import {create} from "zustand";
import {Board, BoardList} from "@/types/board.types";
import LoadingSpinner from "@/components/LoadingSpinner";

export const BoardList = ({boardList, board}: {
  boardList: BoardList,
  board: Board
}) => {
  return (
    <div className="min-w-72 min-h-24 h-fit max-h-full flex flex-col p-2 gap-4 bg-secondary-dark shadow-lg hover:shadow-xl rounded-md border-secondary-dark border hover:border-accent duration-200 cursor-pointer">
      <h2 className="text-white font-semibold text-lg">{boardList.name}</h2>
      <hr className="w-full border border-secondary"/>

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
    <div className="min-w-72 w-72 min-h-24 h-fit flex flex-col p-2 items-center justify-center border-accent border rounded-md text-accent">
      <span className="text-sm font-semibold">Add new List</span>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 w-full">
          <input type="text" required value={listName} className="input-bar" placeholder="Enter new list name" onChange={(e) => setListName(e.target.value)}/>
          <button className="submit-btn h-full">
            {!isCreatingNewBoardList
              ? <RiAddLine/>
              : <LoadingSpinner />
            }
          </button>
        </div>
      </form>
    </div>
  )
}