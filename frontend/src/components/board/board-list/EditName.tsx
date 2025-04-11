import React, {FormEvent, useEffect, useState} from 'react';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {useWebSocketStore} from "@/stores/websocket.store";
import {handleEscapeKeyClose} from "@/lib/util/util";

const EditName = ({currentName, boardListId, close}: {
  currentName: string;
  boardListId: number;
  close: () => void;
}) => {

  const [newName, setNewName] = useState(currentName);

  const {updateBoardList, isPending} = useWebSocketStore();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isPending || newName === currentName || !newName) {
      return;
    }

    updateBoardList({name: newName, boardListId});
    close();
  }

  useEffect(() => {
    window.addEventListener('keydown', (event) => handleEscapeKeyClose(event, close));

    return () => {
      window.removeEventListener('keydown', (event) => handleEscapeKeyClose(event, close));
    }
  }, []);

  return (
    <ClickAwayListener onClickAway={close}>
      <div className="max-w-96 w-full bg-dark text-white rounded-md shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <h4 className="font-semibold text-2xl text-accent px-4 pt-4">Change List Name</h4>
          <div className="input-container px-4">
            <label className="input-label">List Name:</label>
            <input
              type="text"
              className="input-bar"
              placeholder="List Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="flex justify-end items-center p-4 bg-darker gap-4">
            <button type="button" className="danger-btn" onClick={close}>Cancel</button>
            <button type="submit" className="submit-btn">Change Name</button>
          </div>
        </form>
      </div>
    </ClickAwayListener>
  );
};

export default EditName;