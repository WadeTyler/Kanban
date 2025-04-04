package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class BoardWSController {

    private final UserService userService;

    @Autowired
    public BoardWSController(UserService userService) {
        this.userService = userService;
    }

    @MessageMapping("/boards/{boardId}/connected")
    public void connectedToBoard(@DestinationVariable String boardId, Principal principal) throws UnauthorizedException {
        User user = userService.getUser(principal.getName());
        System.out.println("User " + user.getName() + " connected to board " + boardId);
    }
}
