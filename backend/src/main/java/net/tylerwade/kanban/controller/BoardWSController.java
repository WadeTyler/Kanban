package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.dto.CreateBoardListRequest;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class BoardWSController {

    private final SimpMessagingTemplate messagingTemplate;

    private final UserService userService;
    private final BoardService boardService;

    @Autowired
    public BoardWSController(SimpMessagingTemplate messagingTemplate, UserService userService, BoardService boardService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.boardService = boardService;
    }

    @MessageMapping("/boards/{boardId}/connect")
    public void connectedToBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException {
        System.out.println("Here");
        User user = userService.getUser(principal.getName());
        System.out.println("User " + user.getName() + " connected to board " + boardId);
    }

    @MessageMapping("/boards/{boardId}/disconnect")
    public void disconnectFromBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException {
        User user = userService.getUser(principal.getName());
        System.out.println("User " + user.getName() + " disconnected from board " + boardId);
    }

}
