package net.tylerwade.kanban.controller.ListItemWSController;

import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller interface for managing list items in the Kanban application.
 * Provides endpoints for creating, updating, and deleting list items via WebSocket messaging.
 */
@Controller
public interface ListItemWSController {

    /**
     * Handles the creation of a new list item for a specific list in a board.
     *
     * @param boardId                the ID of the board containing the list
     * @param listId                 the ID of the list where the item will be created
     * @param principal              the authenticated user
     * @param createListItemRequest  the request payload containing details of the new list item
     * @throws NotFoundException     if the specified board or list is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/lists/{listId}/items/create")
    void createListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, Principal principal, @Payload CreateListItemRequest createListItemRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    /**
     * Handles the update of a specific list item in a list.
     *
     * @param boardId               the ID of the board containing the list
     * @param listId                the ID of the list containing the item
     * @param itemId                the ID of the list item to update
     * @param principal             the authenticated user
     * @param updateListItemRequest the request payload containing updated details of the list item
     * @throws UnauthorizedException if the user is not authorized to perform this action
     * @throws NotFoundException     if the specified board, list, or item is not found
     * @throws BadRequestException   if the request payload is invalid
     */
    @MessageMapping("/boards/{boardId}/lists/{listId}/items/{itemId}/update")
    void updateListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal, @Payload UpdateListItemRequest updateListItemRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    /**
     * Handles the deletion of a specific list item from a list.
     *
     * @param boardId   the ID of the board containing the list
     * @param listId    the ID of the list containing the item
     * @param itemId    the ID of the list item to delete
     * @param principal the authenticated user
     * @throws NotFoundException     if the specified board, list, or item is not found
     * @throws UnauthorizedException if the user is not authorized to perform this action
     */
    @MessageMapping("/boards/{boardId}/lists/{listId}/items/{itemId}/delete")
    void deleteListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal) throws NotFoundException, UnauthorizedException;

}