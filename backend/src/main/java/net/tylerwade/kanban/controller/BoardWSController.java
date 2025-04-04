package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Controller
public class BoardWSController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final BoardService boardService;

    private final HashMap<String, List<User>> connectedUsers = new HashMap<>();

    @Autowired
    public BoardWSController(SimpMessagingTemplate messagingTemplate, UserService userService, BoardService boardService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.boardService = boardService;
    }

    @MessageMapping("/boards/{boardId}/connect")
    public void connectedToBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException {
        User user = userService.getUser(principal.getName());
        System.out.println("User " + user.getName() + " connected to board " + boardId);

        // Updated connectedUsers map
        List<User> users = connectedUsers.getOrDefault(boardId, new ArrayList<>());
        if (!users.contains(user)) {
            users.add(user);
        }

        connectedUsers.put(boardId, users);


        // Output connected users
        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/connectedUsers", users);
    }

    @MessageMapping("/boards/{boardId}/disconnect")
    public void disconnectFromBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException {
        User user = userService.getUser(principal.getName());
        System.out.println("User " + user.getName() + " disconnected from board " + boardId);

        // Updated connectedUsers map
        List<User> users = connectedUsers.getOrDefault(boardId, new ArrayList<>());
        users.remove(user);
        connectedUsers.put(boardId, users);

        // Output connected users
        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/connectedUsers", users);
    }

}
