'use client';
import React, {useEffect, useState} from 'react';
import {Board, ListItem, UpdateListItemRequest} from "@/types/board.types";
import CloseButton from "@/components/CloseButton";
import UserCard from "@/components/board/UserCard";
import {useWebSocketStore} from "@/stores/websocket.store";
import LoadingSpinner from "@/components/LoadingSpinner";
import {RiDeleteBack2Line, RiDeleteBin2Line} from "@remixicon/react";
import {useBoardUIStore} from "@/stores/board-ui.store";
import {isOverdue} from "@/lib/util";
import StatusType from "@/components/board/StatusType";

const ListItemSettings = ({listItem, closeSettings, board}: {
  listItem: ListItem;
  board: Board;
  closeSettings: () => void;
}) => {

  // Stores
  const {updateListItem, isUpdatingBoardList, deleteListItem} = useWebSocketStore();
  const {focusedListItem} = useBoardUIStore();

  // States
  const [listItemForm, setListItemForm] = useState<ListItem>({...listItem});
  const [isSelectingAssignedTo, setIsSelectingAssignedTo] = useState<boolean>(false);
  const [isSelectingStatus, setIsSelectingStatus] = useState<boolean>(false);

  const isChanged = listItemForm.title !== listItem.title
    || listItemForm.description !== listItem.description
    || listItemForm.color !== listItem.color
    || listItemForm.dueDate !== listItem.dueDate
    || listItemForm.status !== listItem.status
    || listItemForm.assignedTo !== listItem.assignedTo;

  // Function to reset form to original list item
  const resetForm = () => {
    setListItemForm({...listItem});
  }

  // This is necessary because of how we update the list item on changes,
  // so we'll need to 'refresh' the form if focusedListItem changes.
  useEffect(() => {
    resetForm();
  }, [focusedListItem]);

  const handleSave = async () => {
    if (isUpdatingBoardList) return;

    const updateRequest: UpdateListItemRequest = {
      title: listItemForm.title,
      description: listItemForm.description,
      dueDate: listItemForm.dueDate ? listItemForm.dueDate : null,
      status: listItemForm.status,
      assignedTo: listItemForm.assignedTo,
      position: listItem.position,
      color: listItemForm.color
    }

    await updateListItem(updateRequest, listItem.boardListId, listItem.listItemId);
  }

  const handleDelete = async () => {
    if (isUpdatingBoardList) return;

    await deleteListItem(listItem.boardListId, listItem.listItemId);
  }

  // Handle Key Events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeSettings();
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
    <div className="max-w-[55rem] w-full bg-background rounded-md shadow-md flex flex-col gap-4 p-4">

      <header className={`flex items-center justify-between rounded-md p-2 text-white`} style={{
        backgroundColor: listItemForm.color ? listItemForm.color : 'var(--color-secondary)',
      }}>
        <input
          className="text-lg font-semibold border-transparent! focus:outline-none duration-200 cursor-text! w-full"
          value={listItemForm.title}
          required
          maxLength={255}
          onChange={(e) => {
            setListItemForm(prev => ({
              ...prev,
              title: e.target.value
            }));
          }}
        />
        <CloseButton handleClose={closeSettings}/>
      </header>

      <hr className="text-secondary"/>

      <div className="flex gap-4">

        {/* Description */}
        <textarea
          className="input-bar resize-none min-h-full w-full"
          placeholder={`Enter a description for '${listItem.title}'`}
          value={listItemForm.description || ''}
          onChange={(e) => {
            setListItemForm(prev => ({
              ...prev,
              description: e.target.value
            }));
          }}
        ></textarea>

        {/* Settings */}
        <div className="flex flex-col w-full max-w-64 gap-2">
          <h3 className="font-semibold text-center">Settings</h3>
          <hr className="text-secondary"/>

          <div className="flex gap-2 items-center justify-between">
            <label className="text-xs font-semibold">COLOR:</label>
            <input
              type="color"
              className="input-bar p-0! border-none! focus:bg-transparent! bg-transparent! max-w-48 w-full cursor-pointer"
              value={listItemForm.color || '#000'}
              onChange={(e) => {
                setListItemForm(prev => ({
                  ...prev,
                  color: e.target.value
                }));
              }}
            />

            {/* Remove Color button */}
            {listItemForm.color && (
              <RiDeleteBack2Line
                className="hover:text-accent duration-200 cursor-pointer"
                onClick={() => {
                  setListItemForm(prev => ({
                    ...prev,
                    color: null
                  }));
                }}
              />
            )}

          </div>

          {/* Due Date */}
          <div className="flex gap-2 items-center justify-between">
            <label className="text-xs font-semibold">DUE:</label>
            <input
              type="date"
              className={`input-bar p-1! max-w-48 w-full cursor-pointer ${isOverdue(listItemForm.dueDate) && 'bg-danger! text-white! font-semibold border-danger!'}`}
              value={listItemForm.dueDate || ''}
              onChange={(e) => {
                setListItemForm(prev => ({
                  ...prev,
                  dueDate: e.target.value
                }));
              }}
            />
          </div>

          {/* Status */}
          <div className="flex gap-2 items-center justify-between relative">
            <label className="text-xs font-semibold">STATUS:</label>
            <div
              className={`input-bar relative p-1! max-w-48 w-full cursor-pointer ${isSelectingStatus && 'bg-accent/20 border-accent!'}`}
              onClick={() => setIsSelectingStatus(prev => !prev)}
            >
              {!listItemForm.status && (
                <span className="text-sm">--No Status--</span>
              )}

              {listItemForm.status && (
                <StatusType statusType={listItemForm.status}/>
              )}

            </div>
            {isSelectingStatus && (
              <div
                className="absolute left-1/2 top-full mt-1 -translate-x-1/2 bg-secondary-dark text-white rounded-md shadow-md p-2 w-full text-sm max-h-48 overflow-y-scroll z-40 flex flex-col gap-2 items-start justify-start">
                  <span
                    className="p-2 rounded-md hover:bg-accent/20 cursor-pointer duration-200 w-full"
                    onClick={() => {
                      setListItemForm(prev => ({
                        ...prev,
                        status: null
                      }));

                      setIsSelectingStatus(false);
                    }}
                  >
                    --No Status--
                  </span>
                {board.statusTypes.map((statusType) => (
                  <div
                    className="p-2 rounded-md hover:bg-accent/20 cursor-pointer duration-200 w-full flex items-center"
                    key={statusType.id}
                    onClick={() => {
                      setListItemForm(prev => ({
                        ...prev,
                        status: statusType
                      }));

                      setIsSelectingStatus(false);
                    }}
                  >
                    <StatusType statusType={statusType}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned To */}
          <div className="flex gap-2 items-center justify-between relative">
            <label className="text-xs font-semibold">ASSIGNED TO:</label>
            <div
              className={`input-bar relative p-1! max-w-48 w-full cursor-pointer ${isSelectingAssignedTo && 'bg-accent/20 border-accent!'}`}
              onClick={() => setIsSelectingAssignedTo(prev => !prev)}
            >
              {!listItemForm.assignedTo && (
                <span className="text-sm">--No One--</span>
              )}
              {listItemForm.assignedTo && (
                <UserCard user={listItemForm.assignedTo} cn="text-sm"/>
              )}
            </div>
            {isSelectingAssignedTo && (
              <div
                className="absolute left-1/2 top-full mt-1 -translate-x-1/2 bg-secondary-dark text-white rounded-md shadow-md p-2 w-full text-sm max-h-48 overflow-y-scroll z-40">
                <div
                  onClick={() => {
                    setListItemForm(prev => ({
                      ...prev,
                      assignedTo: null
                    }));

                    setIsSelectingAssignedTo(false);
                  }
                  }
                  className="p-2 rounded-md hover:bg-accent/20 cursor-pointer duration-200"
                >
                  --No One--
                </div>

                {board.members.map(member => (
                  <div
                    key={member.userId}
                    onClick={() => {
                      setListItemForm(prev => ({
                        ...prev,
                        assignedTo: member
                      }));

                      setIsSelectingAssignedTo(false);
                    }}
                  >
                    <UserCard user={member}/>
                  </div>
                ))}

              </div>
            )}
          </div>

          <button className="danger-btn" onClick={handleDelete}>
            <RiDeleteBin2Line/>
            Delete
          </button>

        </div>
      </div>

      {isChanged && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center justify-center bg-accent-dark p-2 text-sm rounded-md shadow-md">
          <p className="font-semibold text-white text-xs">You have unsaved changes, don&#39;t forget to save your
            changes!</p>
          <button className="submit-btn text-white!" type="reset" onClick={resetForm}>Reset</button>
          <button className="submit-btn text-white!" type="button" onClick={handleSave} disabled={isUpdatingBoardList}>
            {isUpdatingBoardList ? (
                <LoadingSpinner/>
              )
              : (
                <span>Save</span>
              )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListItemSettings;