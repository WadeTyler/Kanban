package net.tylerwade.kanban.controller;

import net.tylerwade.kanban.dto.APIResponse;
import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.service.BoardService;
import net.tylerwade.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        boards.forEach((board) -> board.setLists(null));
        return ResponseEntity.ok(APIResponse.success("Boards retrieved successfully", boards));
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<?> getBoardById(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.getBoardById(boardId, user);
        return ResponseEntity.ok(APIResponse.success("Board retrieved successfully", board));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBoard(@AuthenticationPrincipal OAuth2User principal, @RequestBody CreateBoardRequest createBoardRequest) throws UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.createBoard(createBoardRequest, user);

        return ResponseEntity.ok(APIResponse.success("Board created successfully", board));
    }

    @PostMapping("/{boardId}/members")
    public ResponseEntity<?> addBoardMember(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal, @RequestBody AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.getBoardById(boardId, user);

        List<User> members = boardService.addMemberToBoard(board, user, addMemberRequest);

        return ResponseEntity.ok(APIResponse.success("Member added successfully", members));
    }

    @DeleteMapping("/{boardId}/members/{memberId}")
    public ResponseEntity<?> removeBoardMember(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.getBoardById(boardId, user);

        List<User> members = boardService.removeMemberFromBoard(board, user, memberId);

        return ResponseEntity.ok(APIResponse.success("Member removed successfully", members));
    }

    @DeleteMapping("/{boardId}/members/leave")
    public ResponseEntity<?> leaveBoard(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException, BadRequestException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.getBoardById(boardId, user);

        boardService.leaveBoard(board, user);

        return ResponseEntity.ok(APIResponse.success("Left board successfully"));
    }

    @PostMapping("/{boardId}/members/{memberId}/promote")
    public ResponseEntity<?> promoteUserToOwner(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException {
        User user = userService.getUser(principal.getAttribute("sub"));
        Board board = boardService.getBoardById(boardId, user);

        Board newBoard = boardService.promoteUserToOwner(board, user, memberId);

        return ResponseEntity.ok(APIResponse.success("User promoted to owner successfully", newBoard));
    }
}
