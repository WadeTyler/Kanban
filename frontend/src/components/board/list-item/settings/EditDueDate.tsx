import {ListItem} from "@/types/board.types";
import {isOverdue} from "@/lib/util/util";
import React, {SetStateAction} from "react";

function EditDueDate(props: { listItemForm: ListItem, setListItemForm: React.Dispatch<SetStateAction<ListItem>>}) {
  return (
    <div className="flex gap-2 items-center justify-between">
      <label className="text-xs font-semibold">DUE:</label>
      <input
        type="date"
        className={`input-bar p-1! max-w-48 w-full cursor-pointer ${isOverdue(props.listItemForm.dueDate) && "bg-danger! text-white! font-semibold border-danger!"}`}
        value={props.listItemForm.dueDate || ""}
        onChange={(e) => {
          props.setListItemForm(prev => ({
            ...prev,
            dueDate: e.target.value
          }));
        }}
      />
    </div>
  );
}

export default EditDueDate;