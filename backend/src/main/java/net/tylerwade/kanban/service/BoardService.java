package net.tylerwade.kanban.service;

import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.Board;
import net.tylerwade.kanban.model.BoardList;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.repository.BoardListRepository;
import net.tylerwade.kanban.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository, BoardListRepository boardListRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
    }

    public Iterable<Board> getAllUserBoards(User user) {
        // Fetch all boards for the user sort by updatedAt
        return boardRepository.findAllByOwnerOrderByUpdatedAtDesc(user);
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
        boardRepository.save(board);

        return board;
    }

    public Board getBoardById(String boardId, User user) throws NotFoundException {
        return boardRepository.findByBoardIdAndOwner(boardId, user).orElseThrow(() -> new NotFoundException("Board not found."));
    }

    public BoardList createBoardList(String boardId, String name, User user) throws NotFoundException {
        Board board = getBoardById(boardId, user);

        // Find the next position for the new list
        int position = board.getLists().stream()
                .mapToInt(BoardList::getPosition)
                .max()
                .orElse(0);

        // If the list is not empty, increment the position
        if (board.getLists().size() > 0) {
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
}
