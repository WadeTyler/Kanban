package net.tylerwade.kanban.controller.BoardListWSController;

import net.tylerwade.kanban.dto.CreateBoardListRequest;
import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.boardlist.BoardListService;
import net.tylerwade.kanban.service.board.BoardService;
import net.tylerwade.kanban.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class BoardListWSControllerImpl implements BoardListWSController {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final BoardService boardService;
    private final BoardListService boardListService;

    @Autowired
    public BoardListWSControllerImpl(SimpMessagingTemplate messagingTemplate, UserService userService, BoardService boardService, BoardListService boardListService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
        this.boardService = boardService;
        this.boardListService = boardListService;
    }

    @Override
    public void createBoardList(@DestinationVariable String boardId, Principal principal, @Payload CreateBoardListRequest createBoardListRequest) throws UnauthorizedException, NotFoundException, BadRequestException {

        User user = userService.getUser(principal.getName());

        Board board = boardService.getBoardById(boardId, user);

        BoardList boardList = boardListService.createBoardList(board, createBoardListRequest.getName(), user);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/new", boardList);
    }

    @Override
    public void updateBoardLists(@DestinationVariable String boardId, Principal principal, @Payload UpdateAllBoardListsRequest updatedBoardListsRequests) throws UnauthorizedException, NotFoundException {
        User user = userService.getUser(principal.getName());
        Board board = boardService.getBoardById(boardId, user);

        BoardList[] updatedBoardLists = boardListService.updateBoardLists(board, updatedBoardListsRequests);

        this.messagingTemplate.convertAndSend("/topic/boards/" + boardId + "/lists/updated/all", updatedBoardLists);
    }

}
