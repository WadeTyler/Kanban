'use client';
import React, {useEffect, useState} from 'react';
import {Board, ListItem} from "@/types/board.types";
import {useBoardUIStore} from "@/stores/board-ui.store";
import EditColor from "@/components/board/list-item/settings/EditColor";
import EditDueDate from "@/components/board/list-item/settings/EditDueDate";
import EditStatus from "@/components/board/list-item/settings/EditStatus";
import EditAssignedTo from "@/components/board/list-item/settings/EditAssignedTo";
import SaveChangesPanel from "@/components/board/list-item/settings/SaveChangesPanel";
import EditDescription from "@/components/board/list-item/settings/EditDescription";
import DeleteListItemButton from "@/components/board/list-item/settings/DeleteListItemButton";
import EditListItemTitle from "@/components/board/list-item/settings/EditListItemTitle";

const ListItemSettings = ({listItem, closeSettings, board}: {
  listItem: ListItem;
  board: Board;
  closeSettings: () => void;
}) => {

  // Stores
  const {focusedListItem} = useBoardUIStore();

  // States
  const [listItemForm, setListItemForm] = useState<ListItem>({...listItem});

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

     <EditListItemTitle listItemForm={listItemForm} setListItemForm={setListItemForm} closeSettings={closeSettings} />

      <div className="flex gap-4">
        <EditDescription listItemForm={listItemForm} setListItemForm={setListItemForm} />
        <div className="flex flex-col w-full max-w-64 gap-2">
          <EditColor listItemForm={listItemForm} setListItemForm={setListItemForm}/>
          <EditDueDate listItemForm={listItemForm} setListItemForm={setListItemForm} />
          <EditStatus statusTypes={board.statusTypes} listItemForm={listItemForm} setListItemForm={setListItemForm} />
          <EditAssignedTo listItemForm={listItemForm} setListItemForm={setListItemForm} members={board.members} />
          <DeleteListItemButton listItem={listItem} />
        </div>
      </div>

      {isChanged && (
        <SaveChangesPanel resetForm={resetForm} listItemForm={listItemForm} listItem={listItem} />
      )}
    </div>
  );
};




export default ListItemSettings;
