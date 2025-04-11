
export const isOverdue = (dueDate: string | null) => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  return date < new Date();
}

export const handleEscapeKeyClose = (e: KeyboardEvent, closeFunction: () => void) => {
  if (e.key === 'Escape') {
    closeFunction();
  }
}