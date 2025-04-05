package net.tylerwade.kanban.service;

import net.tylerwade.kanban.dto.AddMemberRequest;
import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.exception.UnauthorizedException;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.ListItem;
import net.tylerwade.kanban.repository.BoardListRepository;
import net.tylerwade.kanban.repository.BoardRepository;
import net.tylerwade.kanban.repository.ListItemRepository;
import net.tylerwade.kanban.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.*;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;
    private final UserRepository userRepository;
    private final ListItemRepository listItemRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository, BoardListRepository boardListRepository, UserRepository userRepository, ListItemRepository listItemRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
        this.userRepository = userRepository;
        this.listItemRepository = listItemRepository;
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
        removeFromAssignedListItemsInBoard(user, board);

        boardRepository.save(board);

        // Remove user from assigned list items
        removeFromAssignedListItemsInBoard(user, board);

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
        removeFromAssignedListItemsInBoard(user, board);

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

    public BoardList createNewListItem(BoardList boardList, CreateListItemRequest createListItemRequest) throws BadRequestException {
        if (createListItemRequest.getTitle() == null || createListItemRequest.getTitle().isEmpty())
            throw new BadRequestException("Title is required.");

        ListItem newListItem = new ListItem();
        newListItem.setTitle(createListItemRequest.getTitle());
        newListItem.setBoardList(boardList);

        // Find the next position for the new list item
        int position = boardList.getListItems().stream()
                .mapToInt(ListItem::getPosition)
                .max()
                .orElse(0);
        if (!boardList.getListItems().isEmpty()) {
            position++;
        }

        newListItem.setPosition(position);
        boardList.getListItems().add(newListItem);

        listItemRepository.save(newListItem);
        return boardList;
    }

    public BoardList updateListItem(BoardList boardList, Long itemId, UpdateListItemRequest updateListItemRequest) throws BadRequestException {
        // Check fields
        if (updateListItemRequest.getTitle() == null || updateListItemRequest.getTitle().isEmpty())
            throw new BadRequestException("Title is required.");

        if (updateListItemRequest.getPosition() == null || updateListItemRequest.getPosition() < 0)
            throw new BadRequestException("Position is required and cannot be negative.");

        // Find target list item
        ListItem listItem = boardList.getListItems().stream()
                .filter((item) -> Objects.equals(item.getListItemId(), itemId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("List item not found."));

        // Update list item fields
        listItem.setTitle(updateListItemRequest.getTitle());
        listItem.setDescription(updateListItemRequest.getDescription());
        listItem.setStatus(updateListItemRequest.getStatus());
        listItem.setColor(updateListItemRequest.getColor());
        listItem.setAssignedTo(updateListItemRequest.getAssignedTo());
        listItem.setDueDate(updateListItemRequest.getDueDate() != null ? Date.valueOf(updateListItemRequest.getDueDate()) : null);

        // TODO: UPDATE POSITION

        listItemRepository.save(listItem);

        return listItem.getBoardList();
    }

    private void removeFromAssignedListItemsInBoard(User user, Board board) {
        List<BoardList> boardLists = board.getLists();

        for (BoardList boardList : boardLists) {
            List<ListItem> listItems = boardList.getListItems();
            for (ListItem item : listItems) {
                if (item.getAssignedTo().equals(user)) {
                    item.setAssignedTo(null);
                    listItemRepository.save(item);
                }
            }
        }
    }
}
