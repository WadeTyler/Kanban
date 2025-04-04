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
public class BoardListWSController {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final BoardService boardService;

    @Autowired
    public BoardListWSController(SimpMessagingTemplate messagingTemplate, UserService userService, BoardService boardService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.boardService = boardService;
    }

    @MessageMapping("/boards/{boardId}/lists/create")
    @SendTo()
    public void createBoardList(@DestinationVariable String boardId, Principal principal, @Payload CreateBoardListRequest createBoardListRequest) throws UnauthorizedException, NotFoundException {

        User user = userService.getUser(principal.getName());
        if (createBoardListRequest.getName() == null || createBoardListRequest.getName().isEmpty()) {
            // TODO: Handle empty name
            return;
        }

        System.out.println("User " + user.getName() + " creating list " + createBoardListRequest.getName() + " on board " + boardId);
        BoardList boardList = boardService.createBoardList(boardId, createBoardListRequest.getName(), user);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/new", boardList);
    }
}
