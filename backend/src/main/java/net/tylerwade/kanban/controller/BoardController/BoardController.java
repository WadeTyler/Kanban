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

/**
 * REST controller interface for managing boards in the Kanban application.
 * Provides endpoints for retrieving, creating, and managing boards and their members.
 */
@RestController
public interface BoardController {

    /**
     * Retrieves all boards associated with the authenticated user.
     *
     * @param principal the authenticated user
     * @return a ResponseEntity containing the list of boards
     * @throws UnauthorizedException if the user is not authorized
     */
    @GetMapping({"/", ""})
    ResponseEntity<?> getAllUserBoards(@AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException;

    /**
     * Retrieves a specific board by its ID.
     *
     * @param boardId   the ID of the board to retrieve
     * @param principal the authenticated user
     * @return a ResponseEntity containing the board details
     * @throws UnauthorizedException if the user is not authorized
     * @throws NotFoundException     if the board is not found
     */
    @GetMapping("/{boardId}")
    ResponseEntity<?> getBoardById(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException;

    /**
     * Creates a new board for the authenticated user.
     *
     * @param principal          the authenticated user
     * @param createBoardRequest the request body containing board creation details
     * @return a ResponseEntity containing the created board details
     * @throws UnauthorizedException if the user is not authorized
     * @throws BadRequestException   if the request is invalid
     */
    @PostMapping("/create")
    ResponseEntity<?> createBoard(@AuthenticationPrincipal OAuth2User principal, @RequestBody CreateBoardRequest createBoardRequest) throws UnauthorizedException, BadRequestException;

    /**
     * Adds a new member to a specific board.
     *
     * @param boardId          the ID of the board
     * @param principal        the authenticated user
     * @param addMemberRequest the request body containing member details
     * @return a ResponseEntity indicating the result of the operation
     * @throws UnauthorizedException if the user is not authorized
     * @throws NotFoundException     if the board or member is not found
     * @throws BadRequestException   if the request is invalid
     */
    @PostMapping("/{boardId}/members")
    ResponseEntity<?> addBoardMember(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal, @RequestBody AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException;

    /**
     * Removes a member from a specific board.
     *
     * @param boardId   the ID of the board
     * @param memberId  the ID of the member to remove
     * @param principal the authenticated user
     * @return a ResponseEntity indicating the result of the operation
     * @throws UnauthorizedException if the user is not authorized
     * @throws NotFoundException     if the board or member is not found
     */
    @DeleteMapping("/{boardId}/members/{memberId}")
    ResponseEntity<?> removeBoardMember(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws UnauthorizedException, NotFoundException;

    /**
     * Allows the authenticated user to leave a specific board.
     *
     * @param boardId   the ID of the board
     * @param principal the authenticated user
     * @return a ResponseEntity indicating the result of the operation
     * @throws NotFoundException     if the board is not found
     * @throws UnauthorizedException if the user is not authorized
     * @throws BadRequestException   if the request is invalid
     */
    @DeleteMapping("/{boardId}/members/leave")
    ResponseEntity<?> leaveBoard(@PathVariable String boardId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException, BadRequestException;

    /**
     * Promotes a member to the owner role for a specific board.
     *
     * @param boardId   the ID of the board
     * @param memberId  the ID of the member to promote
     * @param principal the authenticated user
     * @return a ResponseEntity indicating the result of the operation
     * @throws NotFoundException     if the board or member is not found
     * @throws UnauthorizedException if the user is not authorized
     */
    @PostMapping("/{boardId}/members/{memberId}/promote")
    ResponseEntity<?> promoteUserToOwner(@PathVariable String boardId, @PathVariable String memberId, @AuthenticationPrincipal OAuth2User principal) throws NotFoundException, UnauthorizedException;

}