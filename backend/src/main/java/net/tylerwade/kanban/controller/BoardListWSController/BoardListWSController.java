package net.tylerwade.kanban.controller.BoardListWSController;

import net.tylerwade.kanban.dto.CreateBoardListRequest;
import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public interface BoardListWSController {

    @MessageMapping("/boards/{boardId}/lists/create")
    void createBoardList(@DestinationVariable String boardId, Principal principal, @Payload CreateBoardListRequest createBoardListRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    @MessageMapping("/boards/{boardId}/lists/update")
    void updateBoardLists(@DestinationVariable String boardId, Principal principal, @Payload UpdateAllBoardListsRequest updatedBoardListsRequests) throws UnauthorizedException, NotFoundException;

}
