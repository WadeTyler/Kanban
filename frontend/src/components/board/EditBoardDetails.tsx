import React, {useEffect} from 'react';
import {Board, UpdateBoardDetailsRequest} from "@/types/board.types";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {useWebSocketStore} from "@/stores/websocket.store";
import {handleEscapeKeyClose} from "@/lib/util/util";
import CloseButton from "@/components/CloseButton";

const EditBoardDetails = ({board, closeFunction}: {
  board: Board;
  closeFunction: () => void;
}) => {

  const [newBoardName, setNewBoardName] = React.useState<string>(board.name);
  const [newDescription, setNewDescription] = React.useState<string>(board.description);

  const {isPending, updateBoard} = useWebSocketStore();

  const isChanged = newBoardName !== board.name || newDescription !== board.description;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPending || !isChanged || !newBoardName) return;

    const updateBoardDetailsRequest: UpdateBoardDetailsRequest = {
      name: newBoardName,
      description: newDescription || null
    };

    updateBoard(updateBoardDetailsRequest);
    closeFunction();
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => handleEscapeKeyClose(e, closeFunction));

    return () => {
      window.removeEventListener('keydown', (e) => handleEscapeKeyClose(e, closeFunction));
    }
  }, []);

  return (
    <ClickAwayListener onClickAway={closeFunction}>
      <div className="w-96 bg-dark rounded-lg shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-white!">
          <div className="flex items-center justify-between pt-4 px-4">
            <span className="text-accent font-semibold text-xl">Edit Board Details</span>
            <CloseButton handleClose={closeFunction} />
          </div>
          <div className="input-container px-4">
            <label className="input-label">Board Name:</label>
            <input type="text" className="input-bar" placeholder="Board Name" value={newBoardName}
                   onChange={(e) => setNewBoardName(e.target.value)} required maxLength={50}/>
          </div>

          <div className="input-container px-4">
            <label className="input-label ">Board Description:</label>
            <textarea className="input-bar resize-none h-48" placeholder="(Optional) Description" value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)} maxLength={500}/>
          </div>

          <div className="bg-darker flex items-center justify-end p-4 text-white gap-4">
            <button type="button" className="danger-btn border-white! hover:border-danger!" onClick={closeFunction}>Cancel</button>
            <button type="submit" className="submit-btn border-white! hover:border-accent!" disabled={!isChanged}>Save Changes</button>
          </div>

        </form>

      </div>
    </ClickAwayListener>
  );
};

export default EditBoardDetails;