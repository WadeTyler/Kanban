'use client';
import React, {FormEvent, useEffect, useState} from 'react';
import {StatusType as StatusType_Type} from "@/types/board.types";
import StatusType from "@/components/board/StatusType";
import {useWebSocketStore} from "@/stores/websocket.store";
import CloseButton from "@/components/CloseButton";
import {RiDeleteBin2Line, RiPencilLine, RiSaveLine} from "@remixicon/react";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const EditStatusTypes = ({statusTypes, close}: {
  statusTypes: StatusType_Type[];
  close: () => void;
}) => {

  // States
  const [newStatus, setNewStatus] = useState('');
  const [newColor, setNewColor] = useState('#000');
  const [editStatusType, setEditStatusType] = useState<StatusType_Type | null>(null);

  // Store
  const {isPending, updateStatusType, createStatusType, deleteStatusType, updatedBoard} = useWebSocketStore();

  // On board change, if the status type we're editing is removed, reset to null
  useEffect(() => {
    if (updatedBoard && editStatusType) {
      if (!updatedBoard.statusTypes.includes(editStatusType)) {
        setEditStatusType(null);
      }
    }
  }, [updatedBoard]);

  const handleCreateNewStatusType = async (e: FormEvent) => {
    e.preventDefault();

    if (isPending || !newStatus || !newColor) return;

    await createStatusType({status: newStatus, color: newColor})
      .then(() => {
        setNewStatus('');
        setNewColor('#000000');
      });
  }

  const handleDeleteStatusType = async () => {
    if (isPending || !editStatusType) return;

    await deleteStatusType(editStatusType.id);
  }

  const handleUpdateStatusType = async (e: FormEvent) => {
    e.preventDefault();

    if (isPending || !editStatusType) return;

    await updateStatusType(editStatusType.id, {color: editStatusType.color, status: editStatusType.status});
  }

  // Handle Key Events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
  }

  // Handle Key Changes
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);


  return (
    <ClickAwayListener onClickAway={close}>
      <div className="w-96 bg-dark text-foreground rounded-md shadow-xl p-4 flex flex-col items-center gap-4">
        <header className="flex justify-between items-center w-full">
          <h5 className="text-accent font-semibold text-xl">Status Types</h5>
          <CloseButton handleClose={close}/>
        </header>
        <hr className="text-secondary w-full"/>

        {/* Status Types */}
        <div className="flex flex-wrap gap-2 w-full">
          {statusTypes.map((statusType) => (
            <div
              key={statusType.id}
              onClick={() => {
                setEditStatusType(statusType);
              }}
            >
              <StatusType statusType={statusType} cn="cursor-pointer"/>
            </div>
          ))}
        </div>

        {/* Editing Status Type */}
        {editStatusType && (
          <>
            <hr className="text-secondary w-full"/>
            <span className="text-accent text-start w-full">Editing Status Type: {editStatusType.status}</span>

            <form className="flex flex-col items-center justify-between gap-2 w-full" onSubmit={handleUpdateStatusType}>
              {/* Edit Status Type */}
              <div className="flex items-center justify-between gap-2 w-full">
                <input
                  type="text"
                  className="p-1 text-white font-semibold rounded-md w-full shadow-md focus:oultine-0 focus:border-none outline-0"
                  style={{
                    backgroundColor: editStatusType.color
                  }}
                  placeholder="Edit Status Type"
                  value={editStatusType.status}
                  onChange={(e) => {
                    setEditStatusType(prev => prev ? ({
                      ...prev,
                      status: e.target.value
                    }) : null);
                  }}
                />
                <input
                  type="color"
                  className="p-1 ml-2 rounded-md shadow-md w-10 h-10 cursor-pointer"
                  value={editStatusType.color}
                  onChange={(e) => {
                    setEditStatusType(prev => prev ? ({
                      ...prev,
                      color: e.target.value
                    }) : null);
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end w-full gap-2 text-white!">
                <button className="danger-btn hover:text-danger! border-white! hover:border-danger!" type="button" onClick={handleDeleteStatusType}>
                  <RiDeleteBin2Line/>
                  Delete
                </button>
                <button className="submit-btn border-white! hover:text-accent! hover:border-accent!" type="submit">
                  <RiSaveLine/>
                  Save
                </button>
              </div>

            </form>


          </>
        )}

        <hr className="text-secondary w-full"/>
        {/* Creating status type*/}
        <form className="flex flex-col gap-2 items-center justify-center w-full" onSubmit={handleCreateNewStatusType}>
          <div className="flex gap-2 items-center justify-center w-full">
            <input
              type="text"
              className="p-1 text-white font-semibold rounded-md w-full shadow-md focus:oultine-0 focus:border-none outline-0"
              style={{
                backgroundColor: newColor
              }}
              placeholder="Enter new Status Name... (Ex: TODO)"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <input
              type="color"
              className="p-1 ml-2 rounded-md shadow-md w-10 h-10 cursor-pointer"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
          </div>

          {newStatus.length > 0 && newColor && (
            <button
              className="submit-btn text-white! hover:text-accent! border-white! hover:border-accent! w-full!"
            >
              <RiPencilLine />
              Create
            </button>
          )}

        </form>


      </div>
    </ClickAwayListener>
  );
};

export default EditStatusTypes;