package net.tylerwade.kanban.controller.BoardController;


import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
public interface BoardController {

    @GetMapping({"/", ""})
    ResponseEntity<?> getAllUserBoards(@AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException;

    @GetMapping("/{boardId}")
    ResponseEntity<?> getBoardById(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException;

    @PostMapping("/create")
    ResponseEntity<?> createBoard(@AuthenticationPrincipal OAuth2User principal, @RequestBody CreateBoardRequest createBoardRequest) throws UnauthorizedException, BadRequestException;

    @PostMapping("/{boardId}/members")
    ResponseEntity<?> addBoardMember(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal, @RequestBody AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    @DeleteMapping("/{boardId}/members/{memberId}")
    ResponseEntity<?> removeBoardMember(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException;

    @DeleteMapping("/{boardId}/members/leave")
    ResponseEntity<?> leaveBoard(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException, BadRequestException;

    @PostMapping("/{boardId}/members/{memberId}/promote")
    ResponseEntity<?> promoteUserToOwner(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException;

}
