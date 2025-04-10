import React, {useState} from 'react';
import ListItemUserCard from "@/components/board/list-item/ListItemUserCard";
import {ListItem} from "@/types/board.types";
import {User} from "@/types/auth.types";

const EditAssignedTo = ({listItemForm, setListItemForm, members}: {
  listItemForm: ListItem;
  setListItemForm: React.Dispatch<React.SetStateAction<ListItem>>;
  members: User[];
}) => {

  const [isSelectingAssignedTo, setIsSelectingAssignedTo] = useState<boolean>(false);

  return (
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
          <ListItemUserCard user={listItemForm.assignedTo} cn="text-sm"/>
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

          {members.map(member => (
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
              <ListItemUserCard user={member}/>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default EditAssignedTo;