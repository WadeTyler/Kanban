'use client';
import React, {useState} from 'react';
import {RiAddLine} from "@remixicon/react";

export const BoardList = () => {
  return (
    <div>

    </div>
  );
};


export const CreateNewBoardList = () => {

  const [listName, setListName] = useState("");

  return (
    <div className="w-72 min-h-24 flex flex-col p-2 items-center justify-center border-accent border rounded-md text-accent">
      <span className="text-sm font-semibold">Add new List</span>

      <form className="form-container">
        <div className="flex items-center gap-2 w-full">
          <input type="text" required value={listName} className="input-bar" placeholder="Enter new list name" onChange={(e) => setListName(e.target.value)}/>
          <button className="submit-btn h-full"><RiAddLine/></button>
        </div>
      </form>
    </div>
  )
}