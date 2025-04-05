'use client';
import {ListItem as ListItemType} from "@/types/board.types";
import {useBoardUIStore} from "@/stores/board-ui.store";
import Label from "@/components/Label";
import {isOverdue} from "@/lib/util";
import StatusType from "@/components/board/StatusType";

const ListItem = ({listItem}: {
  listItem: ListItemType;
}) => {


  const {setFocusedListItem, focusedListItem} = useBoardUIStore();


  const formattedDueDate = () => {
    if (!listItem.dueDate) return null;

    const date = new Date(listItem.dueDate);
    if (date < new Date()) {
      return "Overdue";
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!focusedListItem) {
          setFocusedListItem(listItem);
        }
      }}
      className={`w-full flex flex-col gap-2 p-2 text-white rounded-md shadow-sm hover:shadow-md hover:bg-background/80 duration-200 cursor-pointer`}
      style={{
        background: listItem.color ? listItem.color : 'var(--color-secondary)'
      }}
    >

      {/* Title and Assigned User */}
      <div className="flex gap-1 items-center w-full justify-between">
        <h4 className="text-base font-semibold">
          {listItem.title.length > 20 ? listItem.title.slice(0, 17) + '...' : listItem.title}
        </h4>

        {listItem.assignedTo && (
          <div className="relative group">
            <img
              src={listItem.assignedTo.profilePicture}
              alt="Assigned User"
              className="w-6 h-6 rounded-full shadow-lg"
            />
            <Label text={`${listItem.assignedTo.name}`}/>
          </div>
        )}
      </div>

      <div className="flex gap-1 items-center w-full justify-between">

        {listItem.status && (
          <StatusType statusType={listItem.status} />
        )}

        {listItem.dueDate && (
          <span className={`text-sm ${isOverdue(listItem.dueDate) ? 'text-white bg-danger p-1 rounded-md font-semibold' : 'text-white/70'}`}>
            {!isOverdue(listItem.dueDate) && <span>Due:&nbsp;</span>}
            {formattedDueDate()}
          </span>
        )}

      </div>

    </div>
  );
};

export default ListItem;