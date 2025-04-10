package net.tylerwade.kanban.service.listitem;

import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing list items within a board.
 * Provides methods for creating, updating, deleting, and managing list items.
 */
@Service
public interface ListItemService {

    /**
     * Creates a new list item in the specified board list.
     *
     * @param boardList             the board list where the new item will be added
     * @param createListItemRequest the request object containing details of the new list item
     * @return the updated BoardList object after adding the new list item
     * @throws BadRequestException if the request data is invalid
     */
    BoardList createNewListItem(BoardList boardList, CreateListItemRequest createListItemRequest) throws BadRequestException;

    /**
     * Removes a user from all assigned list items within a specified board.
     *
     * @param user  the user to be removed from the assigned list items
     * @param board the board containing the list items
     */
    void removeFromAssignedListItemsInBoard(User user, Board board);

    /**
     * Updates an existing list item in the specified board list.
     *
     * @param boardList             the board list containing the item to be updated
     * @param itemId                the unique identifier of the list item to be updated
     * @param updateListItemRequest the request object containing updated details of the list item
     * @return the updated BoardList object after modifying the list item
     * @throws BadRequestException if the request data is invalid
     */
    BoardList updateListItem(BoardList boardList, Long itemId, UpdateListItemRequest updateListItemRequest) throws BadRequestException;

    /**
     * Deletes a list item from the specified board list.
     *
     * @param boardList the board list containing the item to be deleted
     * @param itemId    the unique identifier of the list item to be deleted
     * @return the updated BoardList object after removing the list item
     * @throws NotFoundException if the list item with the specified ID is not found
     */
    BoardList deleteListItem(BoardList boardList, Long itemId) throws NotFoundException;
}