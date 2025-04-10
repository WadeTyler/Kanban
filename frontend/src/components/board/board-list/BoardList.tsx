'use client';
import {BoardList as BoardListType} from "@/types/board.types";
import ListItem from "@/components/board/list-item/ListItem";
import CreateNewListItem from "@/components/board/list-item/CreateNewListItem";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export const BoardList = ({boardList}: {
  boardList: BoardListType;
}) => {


  const {attributes, listeners, setNodeRef, transition, transform} = useSortable({
    id: boardList.boardListId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      className="min-w-72 min-h-24 h-fit max-h-full flex flex-col p-2 gap-4 bg-secondary-dark shadow-xl hover:shadow-2xl rounded-md border-secondary-dark border hover:border-accent duration-200 " style={style}>

      <div className="cursor-pointer" ref={setNodeRef} {...attributes} {...listeners}>
        <h2 className="text-white font-semibold text-lg">{boardList.name}</h2>
      </div>

      {boardList.listItems?.sort((a, b) => a.position - b.position)
        .map((listItem) => (
          <ListItem key={listItem.listItemId} listItem={listItem}/>
        ))}

      <CreateNewListItem boardList={boardList}/>

    </div>
  );
};



