import React from 'react';
import {RiDeleteBin2Line} from "@remixicon/react";
import {ListItem} from "@/types/board.types";
import {useWebSocketStore} from "@/stores/websocket.store";

const DeleteListItemButton = ({listItem}: {
  listItem: ListItem;
}) => {

  const {isPending, deleteListItem} = useWebSocketStore();

  const handleDelete = async () => {
    if (isPending) return;

    await deleteListItem(listItem.boardListId, listItem.listItemId);
  }

  return (
    <button className="danger-btn" onClick={handleDelete}>
      <RiDeleteBin2Line/>
      Delete
    </button>
  );
};

export default DeleteListItemButton;