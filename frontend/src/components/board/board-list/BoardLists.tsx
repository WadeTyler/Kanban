import React, {useState} from 'react';
import {Board} from "@/types/board.types";
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {BoardList} from "@/components/board/board-list/BoardList";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor, useSensor,
  useSensors
} from "@dnd-kit/core";
import {BoardList as BoardList_Type} from "../../../types/board.types";
import {useWebSocketStore} from "@/stores/websocket.store";
import BoardListOverlay from "@/components/board/board-list/BoardListOverlay";
import CreateNewBoardList from "@/components/board/board-list/CreateNewBoardList";

const BoardLists = ({board, setBoard}: {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
}) => {

  const {updateAllBoardLists} = useWebSocketStore();

  ////////////////////////// DRAGGABLE //////////////////////////

  const [activeBoardList, setActiveBoardList] = useState<BoardList_Type | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveBoardList(board?.lists?.find(list => list.boardListId === event.active.id) || null);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (active.id !== over?.id && board?.lists) {
      const boardLists = board.lists;

      const oldIndex = boardLists.indexOf(boardLists.find(list => list.boardListId === active.id) as BoardList_Type);
      const newIndex = boardLists.indexOf(boardLists.find(list => list.boardListId === over?.id) as BoardList_Type);

      // Move the list
      const updatedBoardLists: BoardList_Type[] = arrayMove<BoardList_Type>(boardLists, oldIndex, newIndex).map((list, index) => {
        return {
          ...list,
          position: index,  // Update the position of each list
        }
      });

      setBoard({
        ...board,
        lists: updatedBoardLists
      });

      setActiveBoardList(null);

      // Send the updated board list to the server
      updateAllBoardLists(updatedBoardLists);
    }
  }

  return (
    <div className="w-full h-full flex gap-8 overflow-x-scroll overflow-y-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {board.lists && (
          <SortableContext
            items={board.lists?.map(list => (list.boardListId))}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists?.sort((a, b) => a.position - b.position)
              .map((boardList) => (
                <BoardList boardList={boardList} key={boardList.boardListId}/>
              ))}
          </SortableContext>
        )}
        <DragOverlay dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
        }}>
          {activeBoardList && (
            <BoardListOverlay boardList={activeBoardList}/>
          )}
        </DragOverlay>
        <CreateNewBoardList/>
      </DndContext>
    </div>
  );
};

export default BoardLists;