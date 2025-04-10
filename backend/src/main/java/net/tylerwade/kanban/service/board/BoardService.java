package net.tylerwade.kanban.service.board;

import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.dto.CreateUpdateStatusRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service interface for managing boards.
 * Provides methods for creating, retrieving, updating, and deleting boards, as well as managing board members and status types.
 */
@Service
public interface BoardService {

    /**
     * Retrieves all boards associated with a specific user.
     *
     * @param user the user whose boards are to be retrieved
     * @return an iterable collection of boards associated with the user
     */
    Iterable<Board> getAllUserBoards(User user);

    /**
     * Creates a new board for a user.
     *
     * @param request the request object containing details for the new board
     * @param user    the user creating the board
     * @return the created Board object
     * @throws BadRequestException if the request data is invalid
     */
    Board createBoard(CreateBoardRequest request, User user) throws BadRequestException;

    /**
     * Retrieves a specific board by its ID for a user.
     *
     * @param boardId the unique identifier of the board
     * @param user    the user requesting the board
     * @return the Board object corresponding to the given ID
     * @throws NotFoundException if the board is not found
     */
    Board getBoardById(String boardId, User user) throws NotFoundException;

    /**
     * Adds a new member to a board.
     *
     * @param board            the board to which the member will be added
     * @param user             the user performing the operation
     * @param addMemberRequest the request object containing details of the member to be added
     * @return a list of users who are members of the board after the addition
     * @throws UnauthorizedException if the user is not authorized to add members
     * @throws NotFoundException     if the board or member is not found
     * @throws BadRequestException   if the request data is invalid
     */
    List<User> addMemberToBoard(Board board, User user, AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    /**
     * Removes a member from a board.
     *
     * @param board    the board from which the member will be removed
     * @param user     the user performing the operation
     * @param memberId the unique identifier of the member to be removed
     * @return a list of users who are members of the board after the removal
     * @throws UnauthorizedException if the user is not authorized to remove members
     * @throws NotFoundException     if the board or member is not found
     */
    List<User> removeMemberFromBoard(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException;

    /**
     * Allows a user to leave a board.
     *
     * @param board the board the user wants to leave
     * @param user  the user leaving the board
     * @throws BadRequestException if the operation cannot be completed
     */
    void leaveBoard(Board board, User user) throws BadRequestException;

    /**
     * Promotes a member of a board to the owner role.
     *
     * @param board    the board where the promotion will occur
     * @param user     the user performing the promotion
     * @param memberId the unique identifier of the member to be promoted
     * @return the updated Board object after the promotion
     * @throws UnauthorizedException if the user is not authorized to promote members
     * @throws NotFoundException     if the board or member is not found
     */
    Board promoteUserToOwner(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException;

    /**
     * Creates a new status type for a board.
     *
     * @param board   the board where the status type will be created
     * @param request the request object containing details of the new status type
     * @return the updated Board object after adding the status type
     * @throws BadRequestException if the request data is invalid
     * @throws NotFoundException   if the board is not found
     */
    Board createStatusType(Board board, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException;

    /**
     * Removes a status type from a board.
     *
     * @param board        the board from which the status type will be removed
     * @param statusTypeId the unique identifier of the status type to be removed
     * @return the updated Board object after removing the status type
     * @throws NotFoundException if the board or status type is not found
     */
    Board removeStatusType(Board board, Long statusTypeId) throws NotFoundException;

    /**
     * Updates an existing status type in a board.
     *
     * @param board        the board containing the status type to be updated
     * @param statusTypeId the unique identifier of the status type to be updated
     * @param request      the request object containing updated details of the status type
     * @return the updated Board object after modifying the status type
     * @throws BadRequestException if the request data is invalid
     * @throws NotFoundException   if the board or status type is not found
     */
    Board updateStatusType(Board board, Long statusTypeId, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException;

    /**
     * Deletes a board.
     *
     * @param board the board to be deleted
     * @param user  the user performing the deletion
     * @return true if the board was successfully deleted, false otherwise
     * @throws UnauthorizedException if the user is not authorized to delete the board
     * @throws NotFoundException     if the board is not found
     */
    Boolean deleteBoard(Board board, User user) throws UnauthorizedException, NotFoundException;
}