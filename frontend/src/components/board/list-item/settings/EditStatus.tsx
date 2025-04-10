import React, {useState} from 'react';
import StatusType from "@/components/board/StatusType";
import {ListItem, StatusType as StatusType_Type} from "@/types/board.types";

const EditStatus = ({statusTypes, setListItemForm, listItemForm}: {
  statusTypes: StatusType_Type[];
  listItemForm: ListItem;
  setListItemForm: React.Dispatch<React.SetStateAction<ListItem>>;
}) => {

  const [isSelectingStatus, setIsSelectingStatus] = useState<boolean>(false);

  return (
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
          {statusTypes.map((statusType) => (
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
  );
};

export default EditStatus;