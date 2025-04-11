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
  statusTypes: StatusType[];
}

export type StatusType = {
  id: number;
  boardId: string;
  status: string;
  color: string;
}

export type CreateUpdateStatusTypeRequest = {
  status: string;
  color: string;
}

export type BoardList = {
  boardListId: number;
  name: string;
  position: number;
  listItems: ListItem[];
}

export type ListItem = {
  listItemId: number;
  boardListId: number;
  position: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: StatusType | null;
  assignedTo: User | null;
  color: string | null;
}

export type CreateBoardRequest = {
  name: string;
  description: string;
}

export type UpdateListItemRequest = {
  title: string;
  description: string | null;
  dueDate: string | null;
  status: StatusType | null;
  assignedTo: User | null;
  position: number;
  color: string | null;
}

export type UpdateBoardListRequest = {
  boardListId: number;
  name: string;
}