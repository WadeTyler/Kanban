import React from 'react';
import {ListItem} from "@/types/board.types";

const EditDescription = ({listItemForm, setListItemForm}: {
  listItemForm: ListItem;
  setListItemForm: React.Dispatch<React.SetStateAction<ListItem>>;
}) => {
  return (
    <textarea
      className="input-bar resize-none min-h-full w-full"
      placeholder={`Enter a description for '${listItemForm.title}'`}
      value={listItemForm.description || ''}
      onChange={(e) => {
        setListItemForm(prev => ({
          ...prev,
          description: e.target.value
        }));
      }}
    ></textarea>
  );
};

export default EditDescription;