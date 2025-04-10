import {ListItem} from "@/types/board.types";
import {RiDeleteBack2Line} from "@remixicon/react";
import React, {SetStateAction} from "react";

function EditColor(props: { listItemForm: ListItem, setListItemForm: React.Dispatch<SetStateAction<ListItem>>}) {

  return <div className="flex gap-2 items-center justify-between">
    <label className="text-xs font-semibold">COLOR:</label>
    <input
      type="color"
      className="input-bar p-0! border-none! focus:bg-transparent! bg-transparent! max-w-48 w-full cursor-pointer"
      value={props.listItemForm.color || "#000"}
      onChange={(e) => {
        props.setListItemForm(prev => ({
          ...prev,
          color: e.target.value
        }));
      }}
    />

    {/* Remove Color button */}
    {props.listItemForm.color && (
      <RiDeleteBack2Line
        className="hover:text-accent duration-200 cursor-pointer"
        onClick={() => {
          props.setListItemForm(prev => ({
            ...prev,
            color: null
          }));
        }}
      />
    )}
  </div>;
}

export default EditColor;