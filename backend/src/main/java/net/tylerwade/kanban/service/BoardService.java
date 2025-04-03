package net.tylerwade.kanban.service;

import net.tylerwade.kanban.dto.CreateBoardRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.model.Board;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    @Autowired
    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
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
}
