package net.tylerwade.kanban.service.boardlist;

import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing board lists within a board.
 * Provides methods for creating, updating, and retrieving board lists.
 */
@Service
public interface BoardListService {

    /**
     * Creates a new board list within the specified board.
     *
     * @param board the board where the new list will be created
     * @param name the name of the new board list
     * @param user the user creating the board list
     * @return the created BoardList object
     * @throws NotFoundException if the board is not found
     * @throws BadRequestException if the provided data is invalid
     */
    BoardList createBoardList(Board board, String name, User user) throws NotFoundException, BadRequestException;

    /**
     * Updates all board lists within the specified board.
     *
     * @param board the board containing the lists to be updated
     * @param updatedBoardListsRequests the request object containing updated details for all board lists
     * @return an array of updated BoardList objects
     * @throws NotFoundException if the board or any of the lists are not found
     */
    BoardList[] updateBoardLists(Board board, UpdateAllBoardListsRequest updatedBoardListsRequests) throws NotFoundException;

    /**
     * Retrieves a specific board list by its ID from the specified board.
     *
     * @param board the board containing the list
     * @param listId the unique identifier of the board list
     * @return the BoardList object corresponding to the given ID
     * @throws NotFoundException if the board list with the specified ID is not found
     */
    BoardList getBoardListByIdFromBoard(Board board, Long listId) throws NotFoundException;

}