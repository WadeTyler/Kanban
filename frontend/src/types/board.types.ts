import {User} from "@/types/auth.types";

export type Board = {
  boardId: string;
  name: string;
  description: string;
  backgroundImage: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  members: User[];
  lists?: BoardList[];
}

export type BoardList = {
  boardListId: number;
  name: string;
  position: number;
}

export type CreateBoardRequest = {
  name: string;
  description: string;
}