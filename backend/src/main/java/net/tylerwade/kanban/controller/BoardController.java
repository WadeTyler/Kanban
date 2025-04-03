package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.dto.APIResponse;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.Board;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;

    @Autowired
    public BoardController(BoardService boardService, UserService userService) {
        this.boardService = boardService;
        this.userService = userService;
    }

    @GetMapping({"/", ""})
    public ResponseEntity<?> getAllUserBoards(@AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Iterable<Board> boards = boardService.getAllUserBoards(user);
        return ResponseEntity.ok(APIResponse.success("Boards retrieved successfully", boards));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBoard(@AuthenticationPrincipal OAuth2User principal, @RequestBody CreateBoardRequest createBoardRequest) throws UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.createBoard(createBoardRequest, user);

        return ResponseEntity.ok(APIResponse.success("Board created successfully", board));
    }
}
