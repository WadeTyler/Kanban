package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.dto.CreateBoardListRequest;
import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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

    @MessageMapping("/boards/{boardId}/lists/{listId}/items/create")
    public void createListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, Principal principal, @Payload CreateListItemRequest createListItemRequest) throws NotFoundException, UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = getBoardListByIdFromBoard(board, listId);

        BoardList updatedBoardList = boardService.createNewListItem(boardList, createListItemRequest);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated", updatedBoardList);
    }

    @MessageMapping("/boards/{boardId}/lists/{listId}/items/{itemId}/update")
    public void updateListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal, @Payload UpdateListItemRequest updateListItemRequest) throws UnauthorizedException, NotFoundException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = getBoardListByIdFromBoard(board, listId);

        BoardList updatedBoardList = boardService.updateListItem(boardList, itemId, updateListItemRequest);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated", updatedBoardList);
    }

    // Utility method to get a BoardList by its ID from a Board
    private BoardList getBoardListByIdFromBoard(Board board, Long listId) throws NotFoundException {
        return board.getLists().stream()
                .filter(list -> list.getBoardListId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("List not found"));
    }
}
