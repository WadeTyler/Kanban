import {BoardList} from "@/types/board.types";
import React, {FormEvent, useState} from "react";
import {useWebSocketStore} from "@/stores/websocket.store";

const CreateNewListItem = ({boardList}: {
  boardList: BoardList;
}) => {

  // States
  const [title, setTitle] = useState<string>("");

  // Stores
  const {isPending, createListItem} = useWebSocketStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isPending || !title) return;

    await createListItem(title, boardList.boardListId).then(() => {
      setTitle("");
    })
  }

  return (
    <div className="w-full flex flex-col gap-2">

      <form onSubmit={handleSubmit}>
        <input type="text" className="input-bar border-accent! text-accent!" disabled={isPending} placeholder="Create new Item"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
        />
      </form>

    </div>
  )
}

export default CreateNewListItem;