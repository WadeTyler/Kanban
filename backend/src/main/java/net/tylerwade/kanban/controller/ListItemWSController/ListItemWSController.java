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

@Controller
public interface ListItemWSController {

    @MessageMapping("/boards/{boardId}/lists/{listId}/items/create")
    void createListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, Principal principal, @Payload CreateListItemRequest createListItemRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    @MessageMapping("/boards/{boardId}/lists/{listId}/items/{itemId}/update")
    void updateListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal, @Payload UpdateListItemRequest updateListItemRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    @MessageMapping("/boards/{boardId}/lists/{listId}/items/{itemId}/delete")
    void deleteListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal) throws NotFoundException, UnauthorizedException;

}
