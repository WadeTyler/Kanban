package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.dto.CreateUpdateStatusRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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

    // Connect to board and output connected users
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

    // Disconnect from board
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

    // Add status type to board and output updated board
    @MessageMapping("/boards/{boardId}/status-types/create")
    public void createStatusType(@DestinationVariable String boardId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        System.out.println("User " + user.getName() + " creating status type on board " + boardId);

        Board updatedBoard = boardService.createStatusType(board, createUpdateStatusRequest);

        // Output updated board
        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/updated", updatedBoard);
    }


    // Remove status type and output updated board
    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/delete")
    public void deleteStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal) throws NotFoundException, UnauthorizedException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        Board updatedBoard = boardService.removeStatusType(board, statusTypeId);

        // Output updated board
        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/updated", updatedBoard);
    }

    @MessageMapping("/boards/{boardId}/status-types/{statusTypeId}/update")
    public void updateStatusType(@DestinationVariable String boardId, @DestinationVariable Long statusTypeId, Principal principal, @Payload CreateUpdateStatusRequest createUpdateStatusRequest) throws NotFoundException, UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        System.out.println("User " + user.getName() + " updating status type on board " + boardId);

        Board updatedBoard = boardService.updateStatusType(board, statusTypeId, createUpdateStatusRequest);

        // Output updated board
        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/updated", updatedBoard);
    }

}
