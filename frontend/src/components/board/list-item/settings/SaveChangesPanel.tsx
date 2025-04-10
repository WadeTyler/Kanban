import React from 'react';
import LoadingSpinner from "@/components/LoadingSpinner";
import {useWebSocketStore} from "@/stores/websocket.store";
import {ListItem, UpdateListItemRequest} from "@/types/board.types";

const SaveChangesPanel = ({resetForm, listItemForm, listItem}: {
  resetForm: () => void;
  listItemForm: ListItem;
  listItem: ListItem;
}) => {

  const {isPending, updateListItem} = useWebSocketStore();


  const handleSave = async () => {
    if (isPending) return;

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

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center justify-center bg-accent-dark p-2 text-sm rounded-md shadow-md">
      <p className="font-semibold text-white text-xs">You have unsaved changes, don&#39;t forget to save your
        changes!</p>
      <button className="submit-btn text-white! border-white! hover:border-accent!" type="reset"
              onClick={resetForm}>Reset
      </button>
      <button className="submit-btn text-white! border-white! hover:border-accent!" type="button" onClick={handleSave}
              disabled={isPending}>
        {isPending ? (
            <LoadingSpinner/>
          )
          : (
            <span>Save</span>
          )}
      </button>
    </div>
  );
};

export default SaveChangesPanel;