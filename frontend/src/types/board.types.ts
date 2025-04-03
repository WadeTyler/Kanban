export type Board = {
  boardId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export type CreateBoardRequest = {
  name: string;
  description: string;
}