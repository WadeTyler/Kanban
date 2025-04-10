package net.tylerwade.kanban.controller.ListItemWSController;

import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.service.boardlist.BoardListService;
import net.tylerwade.kanban.service.board.BoardService;
import net.tylerwade.kanban.service.listitem.ListItemService;
import net.tylerwade.kanban.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ListItemWSControllerImpl implements ListItemWSController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final BoardService boardService;
    private final ListItemService listItemService;
    private final BoardListService boardListService;

    @Autowired
    public ListItemWSControllerImpl(SimpMessagingTemplate messagingTemplate, UserService userService, BoardService boardService, ListItemService listItemService, BoardListService boardListService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.boardService = boardService;
        this.listItemService = listItemService;
        this.boardListService = boardListService;
    }

    // Endpoint to create new list item
    @Override
    public void createListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, Principal principal, @Payload CreateListItemRequest createListItemRequest) throws NotFoundException, UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = boardListService.getBoardListByIdFromBoard(board, listId);

        BoardList updatedBoardList = listItemService.createNewListItem(boardList, createListItemRequest);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated", updatedBoardList);
    }

    // Endpoint to update a list item
    @Override
    public void updateListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal, @Payload UpdateListItemRequest updateListItemRequest) throws UnauthorizedException, NotFoundException, BadRequestException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = boardListService.getBoardListByIdFromBoard(board, listId);

        BoardList updatedBoardList = listItemService.updateListItem(boardList, itemId, updateListItemRequest);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated", updatedBoardList);
    }

    @Override
    public void deleteListItem(@DestinationVariable String boardId, @DestinationVariable Long listId, @DestinationVariable Long itemId, Principal principal) throws NotFoundException, UnauthorizedException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = boardListService.getBoardListByIdFromBoard(board, listId);

        BoardList updatedBoardList = listItemService.deleteListItem(boardList, itemId);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated", updatedBoardList);
    }

}
