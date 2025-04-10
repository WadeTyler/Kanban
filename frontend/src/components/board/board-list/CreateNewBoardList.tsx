import {useWebSocketStore} from "@/stores/websocket.store";
import React, {FormEvent, useState} from "react";
import {RiAddLine} from "@remixicon/react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const CreateNewBoardList = () => {

  // Store
  const {createBoardList, isPending} = useWebSocketStore();

  // States
  const [listName, setListName] = useState("");

  // Handle Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!listName || isPending) return;

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
            {!isPending
              ? <RiAddLine/>
              : <LoadingSpinner/>
            }
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateNewBoardList;