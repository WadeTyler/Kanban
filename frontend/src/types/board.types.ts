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
  listItems: ListItem[];
}

export type ListItem = {
  listItemId: number;
  boardList: BoardList;
  position: number;
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  assignedTo?: User;
}

export type CreateBoardRequest = {
  name: string;
  description: string;
}