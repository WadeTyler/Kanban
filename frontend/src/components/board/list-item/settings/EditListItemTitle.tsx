import React from 'react';
import CloseButton from "@/components/CloseButton";
import {ListItem} from "@/types/board.types";

const EditListItemTitle = ({listItemForm, setListItemForm, closeSettings}: {
  listItemForm: ListItem;
  setListItemForm: React.Dispatch<React.SetStateAction<ListItem>>;
  closeSettings: () => void;
}) => {
  return (
    <div className={`flex items-center justify-between rounded-md p-2 text-white`} style={{
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
    </div>
  );
};

export default EditListItemTitle;