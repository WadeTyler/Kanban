package net.tylerwade.kanban.service;

import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.Board;
import net.tylerwade.kanban.model.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.repository.BoardListRepository;
import net.tylerwade.kanban.repository.BoardRepository;
import net.tylerwade.kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;
    private final UserRepository userRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository, BoardListRepository boardListRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
        this.userRepository = userRepository;
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

        if (request.getDescription() == null || request.getDescription().isEmpty()) {
            throw new BadRequestException("Board description cannot be null or empty");
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

    public BoardList createBoardList(String boardId, String name, User user) throws NotFoundException {
        Board board = getBoardById(boardId, user);

        // Find the next position for the new list
        int position = board.getLists().stream()
                .mapToInt(BoardList::getPosition)
                .max()
                .orElse(0);

        // If the list is not empty, increment the position
        if (!board.getLists().isEmpty()) {
            position++;
        }

        // Create the new list
        BoardList boardList = new BoardList();
        boardList.setName(name);
        boardList.setPosition(position);
        boardList.setBoard(board);

        boardListRepository.save(boardList);
        board.getLists().add(boardList);
        boardRepository.save(board);
        return boardList;
    }

    public List<User> addMemberToBoard(Board board, User user, AddMemberRequest addMemberRequest) throws UnauthorizedException, NotFoundException, BadRequestException {
        if (addMemberRequest.getEmail() == null || addMemberRequest.getEmail().isEmpty()) {
            throw new BadRequestException("Email is required.");
        }

        // Check if owner of board
        if (!board.getOwner().getUserId().equals(user.getUserId())) throw new UnauthorizedException("You are not authorized to add members.");

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
        boardRepository.save(board);

        return board.getMembers();
    }
}
