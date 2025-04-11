package net.tylerwade.kanban.controller.BoardListWSController;

import net.tylerwade.kanban.dto.CreateBoardListRequest;
import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.dto.UpdateBoardListRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller interface for managing board lists in the Kanban application.
 * Provides endpoints for creating and updating board lists via WebSocket messaging.
 */
@Controller
public interface BoardListWSController {

    /**
     * Handles the creation of a new board list for a specific board.
     *
     * @param boardId                the ID of the board where the list will be created
     * @param principal              the authenticated user
     * @param createBoardListRequest the request payload containing details of the new board list
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws NotFoundException     if the specified board is not found
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/lists/create")
    void createBoardList(@DestinationVariable String boardId, Principal principal, @Payload CreateBoardListRequest createBoardListRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    /**
     * Handles the update of all board lists for a specific board.
     *
     * @param boardId                   the ID of the board whose lists will be updated
     * @param principal                 the authenticated user
     * @param updatedBoardListsRequests the request payload containing the updated details of all board lists
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws NotFoundException     if the specified board is not found
     */
    @MessageMapping("/boards/{boardId}/lists/update")
    void updateAllBoardLists(@DestinationVariable String boardId, Principal principal, @Payload UpdateAllBoardListsRequest updatedBoardListsRequests) throws UnauthorizedException, NotFoundException;

    /**
     * Handles updating a single board list for a specific board.
     *
     * @param boardId                the ID of the board where the list is located
     * @param listId                 the ID of the list to be updated
     * @param principal              the authenticated user
     * @param updateBoardListRequest the request payload containing the updated details of the board list
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws NotFoundException     if the specified board or list is not found
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/lists/{listId}/update")
    void updateBoardList(@DestinationVariable String boardId, @DestinationVariable Long listId, Principal principal, @Payload UpdateBoardListRequest updateBoardListRequest) throws UnauthorizedException, NotFoundException, BadRequestException;


}