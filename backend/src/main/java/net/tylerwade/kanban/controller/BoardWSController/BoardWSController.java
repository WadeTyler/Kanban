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

@Controller
public interface BoardWSController {

    @MessageMapping("/boards/{boardId}/connect")
    void connectedToBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException;

    @MessageMapping("/boards/{boardId}/disconnect")
    void disconnectFromBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException;

    @MessageMapping("/boards/{boardId}/status-types/create")
    void createStatusType(@DestinationVariable String boardId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/delete")
    void deleteStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal) throws NotFoundException, UnauthorizedException;

    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/update")
    void updateStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException;

    @MessageMapping("/boards/{boardId}/delete")
    void deleteBoard(@DestinationVariable String boardId, Principal principal) throws NotFoundException, UnauthorizedException;
}
