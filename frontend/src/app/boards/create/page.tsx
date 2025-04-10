'use client';
import React, {FormEvent, useState} from 'react';
import AuthProvider from "@/providers/AuthProvider";
import {CreateBoardRequest} from "@/types/board.types";
import {RiAddLine} from "@remixicon/react";
import useBoardStore from "@/stores/board.store";
import LoadingSpinner from "@/components/LoadingSpinner";
import {useRouter} from "next/navigation";

const Page = () => {
  // Navigation
  const router = useRouter();

  // States
  const [createBoardRequest, setCreateBoardRequest] = useState<CreateBoardRequest>({
    name: "",
    description: ""
  });

  const {createBoard, createBoardError, isCreatingBoard} = useBoardStore();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!createBoardRequest.name || createBoardRequest.name.length < 3 || createBoardRequest.description.length > 500) {
      return;
    }

    await createBoard(createBoardRequest).then((board) => {
      if (board) {
        router.push(`/boards/${board.boardId}`);
      }
    });
  }

  return (
    <AuthProvider authRequired={true}>
      <div className="w-full page-padding flex flex-col items-center">

        {/* Container */}
        <div className="w-full max-w-[55rem] flex flex-col items-center gap-4">

          <header className="flex flex-col items-center w-full gap-1">
            <h1 className="text-accent text-3xl font-semibold">Create new Board</h1>
            <h2 className="text-secondary text-lg">Let&#39;s go ahead and create a new board. Just enter a few
              details</h2>
          </header>

          <hr className="border w-full border-secondary"/>


          <form className="form-container max-w-96" onSubmit={handleFormSubmit}>
            <div className="input-container">
              <label className="input-label">Board Name:</label>
              <input type="text" className="input-bar" name="name" required maxLength={50} minLength={3}
                     placeholder="Enter a name for your new board" onChange={(e) => {
                setCreateBoardRequest(prev => ({
                  ...prev,
                  name: e.target.value
                }));
              }}/>
            </div>
            <div className="input-container">
              <label className="input-label">Board Description:</label>
              <textarea className="input-bar resize-none h-24" name="description" maxLength={500}
                        placeholder="(Optional) Enter a description for your board." onChange={(e) => {
                setCreateBoardRequest(prev => ({
                  ...prev,
                  description: e.target.value
                }));
              }}/>
            </div>

            <button type="submit" className={`submit-btn2 w-full ${isCreatingBoard && 'bg-accent-dark!'}`} disabled={isCreatingBoard}>
              {isCreatingBoard
                ? (
                  <>
                    <LoadingSpinner />
                  </>
                )
                : (<>
                    <RiAddLine/>
                    <span>Create Board</span>
                  </>
                )
              }
            </button>

            {createBoardError && (
              <p className="text-danger text-sm">{createBoardError}</p>
            )}

          </form>

        </div>

      </div>
    </AuthProvider>
  );
};

export default Page;