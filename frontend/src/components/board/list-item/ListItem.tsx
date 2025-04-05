'use client';
import {ListItem as ListItemType} from "@/types/board.types";
import {useBoardUIStore} from "@/stores/board-ui.store";
import Label from "@/components/Label";

const ListItem = ({listItem}: {
  listItem: ListItemType;
}) => {


  const { setFocusedListItem, focusedListItem } = useBoardUIStore();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!focusedListItem) {
          setFocusedListItem(listItem);
        }
      }}
      className={`w-full flex flex-col gap-2 p-2 text-foreground rounded-md shadow-sm hover:shadow-md hover:bg-background/80 duration-200 cursor-pointer`}
      style={{
        background: listItem.color ? listItem.color : 'var(--color-background)'
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
            <Label text={`${listItem.assignedTo.name}`} />
          </div>
        )}
      </div>

      <div className="flex gap-1 items-center w-full justify-between">

        {listItem.status && (
          <span className="text-sm text-foreground/70">
            {listItem.status.length > 20 ? listItem.status.slice(0, 17) + '...' : listItem.status}
          </span>
        )}

        {listItem.dueDate && (
          <span className="text-sm text-foreground/70">
            Due:&nbsp;
            {new Date(listItem.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </span>
        )}

      </div>

    </div>
  );
};

export default ListItem;