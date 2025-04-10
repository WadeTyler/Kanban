package net.tylerwade.kanban.service.board;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.dto.*;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.BoardStatusType;
import net.tylerwade.kanban.repository.*;
import net.tylerwade.kanban.service.listitem.ListItemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ListItemServiceImpl listItemService;

    @Autowired
    public BoardServiceImpl(BoardRepository boardRepository, UserRepository userRepository, ListItemServiceImpl listItemService) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.listItemService = listItemService;
    }

    public Iterable<Board> getAllUserBoards(User user) {
        // Fetch all boards for the user sort by updatedAt
        return boardRepository.findAllByMembersContainsOrderByUpdatedAtDesc(user);
    }

    public Board createBoard(CreateBoardRequest request, User user) throws BadRequestException {
        // Check requests values
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new BadRequestException("Board name cannot be null or empty");
        }

        // Check if user already has a board with the same name
        if (boardRepository.existsByNameAndOwner(request.getName(), user)) {
            throw new BadRequestException("You already have a board with this name");
        }

        // Create a new board
        Board board = new Board(request.getName(), request.getDescription(), user);
        ArrayList<User> members = new ArrayList<>();
        members.add(user);
        board.setMembers(members);
        boardRepository.save(board);

        return board;
    }

    public Board getBoardById(String boardId, User user) throws NotFoundException {
        return boardRepository.findByBoardIdAndMembersContains(boardId, user).orElseThrow(() -> new NotFoundException("Board not found or you not a member of this board."));
    }

    public List<User> addMemberToBoard(Board board, User user, AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException {
        if (addMemberRequest.getEmail() == null || addMemberRequest.getEmail().isEmpty()) {
            throw new BadRequestException("Email is required.");
        }

        // Check if owner of board
        if (!board.getOwner().getUserId().equals(user.getUserId()))
            throw new UnauthorizedException("You are not authorized to add members.");

        // Check if user is a member
        if (!board.getMembers().contains(user)) {
            throw new UnauthorizedException("You are not authorized to add members.");
        }

        // Check if target user exists
        User targetUser = userRepository.findByEmailEqualsIgnoreCase(addMemberRequest.getEmail()).orElseThrow(() -> new NotFoundException("User not found."));

        // Check if target user is already a member
        if (board.getMembers().contains(targetUser)) {
            throw new BadRequestException("User is already a member of this board.");
        }

        // Add target user to board
        board.getMembers().add(targetUser);
        boardRepository.save(board);
        return board.getMembers();
    }

    public List<User> removeMemberFromBoard(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException {

        if (!board.getOwner().equals(user)) {
            throw new UnauthorizedException("You are not authorized to remove members.");
        }

        // Check if user is a member
        if (!board.getMembers().contains(user)) {
            throw new NotFoundException("User is not a member of this board.");
        }

        board.getMembers().removeIf((member) -> member.getUserId().equals(memberId));
        listItemService.removeFromAssignedListItemsInBoard(user, board);

        boardRepository.save(board);

        // Remove user from assigned list items
        listItemService.removeFromAssignedListItemsInBoard(user, board);

        return board.getMembers();
    }

    public void leaveBoard(Board board, User user) throws BadRequestException {
        // Check if user is a member of the board
        if (!board.getMembers().contains(user)) {
            throw new BadRequestException("You are not a member of this board.");
        }

        // Check if user is the owner of the board
        if (board.getOwner().equals(user)) {
            throw new BadRequestException("You cannot leave your own board.");
        }

        // Remove user from board members
        List<User> members = board.getMembers();
        members.remove(user);
        board.setMembers(members);

        // Remove user from assigned list items
        listItemService.removeFromAssignedListItemsInBoard(user, board);

        // Save the board
        boardRepository.save(board);
    }

    public Board promoteUserToOwner(Board board, User user, String memberId) throws UnauthorizedException, NotFoundException {
        // Check if owner of the board
        if (!board.getOwner().equals(user)) {
            throw new UnauthorizedException("You are not authorized to promote members.");
        }

        // Check if self
        if (user.getUserId().equals(memberId)) {
            throw new UnauthorizedException("You cannot promote yourself.");
        }

        // Check if target member is a member of the board
        User targetMember = board.getMembers().stream()
                .filter(member -> member.getUserId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Target user is not a member of this board."));

        // Promote target member to owner
        board.setOwner(targetMember);
        boardRepository.save(board);
        return board;
    }

    @Transactional
    public Board createStatusType(Board board, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException {
        // Check status field
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            throw new BadRequestException("Status cannot be null or empty");
        }

        // Check color field
        if (request.getColor() == null || request.getColor().isEmpty()) {
            throw new BadRequestException("Color cannot be null or empty");
        }

        Board managedBoard = boardRepository.findById(board.getBoardId())
                .orElseThrow(() -> new NotFoundException("Board not found."));

        // Create new status type
        BoardStatusType newBoardStatusType = new BoardStatusType(managedBoard, request.getStatus(), request.getColor());

        // Save
        managedBoard.getStatusTypes().add(newBoardStatusType);
        boardRepository.save(managedBoard);

        // Return the board
        return managedBoard;
    }

    @Transactional
    public Board removeStatusType(Board board, Long statusTypeId) throws NotFoundException {

        // Get managed board instance
        Board managedBoard = boardRepository.findById(board.getBoardId())
                .orElseThrow(() -> new NotFoundException("Board not found."));

        // Find Status Type
        BoardStatusType statusType = managedBoard.getStatusTypes().stream()
                .filter(type -> type.getId().equals(statusTypeId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Status type not found."));

        // Remove the status type from all list items in the board
        managedBoard.getLists().forEach(boardList -> boardList.getListItems()
                .forEach(listItem -> {
                    if (listItem.getStatus() != null && listItem.getStatus().getId().equals(statusTypeId)) {
                        listItem.setStatus(null);
                    }
                }));

        // Remove the status type from the board's list
        managedBoard.getStatusTypes().remove(statusType);

        boardRepository.save(managedBoard);
        // Return the updated board
        return managedBoard;
    }

    @Transactional
    public Board updateStatusType(Board board, Long statusTypeId, CreateUpdateStatusRequest request) throws BadRequestException, NotFoundException {
        // Check fields
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            throw new BadRequestException("Status cannot be null or empty");
        }

        if (request.getColor() == null || request.getColor().isEmpty()) {
            throw new BadRequestException("Color cannot be null or empty");
        }

        // Get Managed board
        Board managedBoard = boardRepository.findById(board.getBoardId())
                .orElseThrow(() -> new NotFoundException("Board not found."));

        // Find status type
        BoardStatusType statusType = managedBoard.getStatusTypes().stream()
                .filter(type -> type.getId().equals(statusTypeId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Status type not found."));

        // Update status type
        statusType.setStatus(request.getStatus());
        statusType.setColor(request.getColor());

        // Update the status type in the board's list
        managedBoard.getStatusTypes().removeIf(type -> type.getId().equals(statusTypeId));
        managedBoard.getStatusTypes().add(statusType);

        // Save the updated board
        boardRepository.save(managedBoard);

        // Return the updated board
        return managedBoard;
    }

    @Transactional
    public Boolean deleteBoard(Board board, User user) throws UnauthorizedException, NotFoundException {

        Board managedBoard = boardRepository.findById(board.getBoardId())
                .orElseThrow(() -> new NotFoundException("Board not found."));

        // Verify is owner of board
        if (!managedBoard.getOwner().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("You are not authorized to delete this board.");
        }

        // Delete the board
        boardRepository.delete(managedBoard);
        return true;
    }
}
