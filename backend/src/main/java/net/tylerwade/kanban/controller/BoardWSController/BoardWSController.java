package net.tylerwade.kanban.controller.BoardWSController;

import net.tylerwade.kanban.dto.CreateUpdateStatusRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller interface for managing boards in the Kanban application.
 * Provides endpoints for connecting, disconnecting, and managing board status types via WebSocket messaging.
 */
@Controller
public interface BoardWSController {

    /**
     * Handles the connection of a user to a specific board.
     *
     * @param boardId   the ID of the board to connect to
     * @param principal the authenticated user
     * @throws UnauthorizedException if the user is not authorized to connect to the board
     */
    @MessageMapping("/boards/{boardId}/connect")
    void connectedToBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException;

    /**
     * Handles the disconnection of a user from a specific board.
     *
     * @param boardId   the ID of the board to disconnect from
     * @param principal the authenticated user
     * @throws UnauthorizedException if the user is not authorized to disconnect from the board
     */
    @MessageMapping("/boards/{boardId}/disconnect")
    void disconnectFromBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException;

    /**
     * Handles the creation of a new status type for a specific board.
     *
     * @param boardId                   the ID of the board where the status type will be created
     * @param principal                 the authenticated user
     * @param createUpdateStatusRequest the request payload containing details of the new status type
     * @throws NotFoundException     if the specified board is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/status-types/create")
    void createStatusType(@DestinationVariable String boardId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    /**
     * Handles the deletion of a specific status type from a board.
     *
     * @param boardId      the ID of the board
     * @param statusTypeId the ID of the status type to delete
     * @param principal    the authenticated user
     * @throws NotFoundException     if the specified board or status type is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     */
    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/delete")
    void deleteStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal) throws NotFoundException, UnauthorizedException;

    /**
     * Handles the update of a specific status type for a board.
     *
     * @param boardId                   the ID of the board
     * @param statusTypeId              the ID of the status type to update
     * @param principal                 the authenticated user
     * @param createUpdateStatusRequest the request payload containing updated details of the status type
     * @throws NotFoundException     if the specified board or status type is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/update")
    void updateStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    /**
     * Handles the deletion of a specific board.
     *
     * @param boardId   the ID of the board to delete
     * @param principal the authenticated user
     * @throws NotFoundException     if the specified board is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     */
    @MessageMapping("/boards/{boardId}/delete")
    void deleteBoard(@DestinationVariable String boardId, Principal principal) throws NotFoundException, UnauthorizedException;
}