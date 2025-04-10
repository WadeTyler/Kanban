package net.tylerwade.kanban.service.boardlist;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.repository.BoardListRepository;
import net.tylerwade.kanban.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardListServiceImpl implements BoardListService {
    private final BoardRepository boardRepository;
    private final BoardListRepository boardListRepository;

    @Autowired
    public BoardListServiceImpl(BoardRepository boardRepository, BoardListRepository boardListRepository) {
        this.boardRepository = boardRepository;
        this.boardListRepository = boardListRepository;
    }

    @Transactional
    public BoardList createBoardList(Board board, String name, User user) throws NotFoundException, BadRequestException {

        if (name == null || name.isEmpty()) throw new BadRequestException("List name cannot be null or empty.");

        Board managedBoard = boardRepository.findById(board.getBoardId())
                .orElseThrow(() -> new NotFoundException("Board not found."));

        // Find the next position for the new list
        int position = managedBoard.getLists().stream()
                .mapToInt(BoardList::getPosition)
                .max()
                .orElse(0);

        // If the list is not empty, increment the position
        if (!managedBoard.getLists().isEmpty()) {
            position++;
        }

        // Create the new list
        BoardList boardList = new BoardList();
        boardList.setName(name);
        boardList.setPosition(position);
        boardList.setBoard(managedBoard);

        boardListRepository.save(boardList);
        managedBoard.getLists().add(boardList);
        boardRepository.save(managedBoard);
        return boardList;
    }

    @Transactional
    public BoardList[] updateBoardLists(Board board, UpdateAllBoardListsRequest updatedBoardListsRequests) throws NotFoundException {

        List<BoardList> updatedBoardLists = new ArrayList<>();

        for (BoardList updatedList : updatedBoardListsRequests.getUpdatedBoardLists()) {
            // find existing list
            BoardList existingList = boardListRepository.findById(updatedList.getBoardListId())
                    .orElseThrow(() -> new NotFoundException("Board list not found"));

            existingList.setPosition(updatedList.getPosition());
            boardListRepository.save(existingList);
            // Add to new array
            updatedBoardLists.add(existingList);
        }

        return updatedBoardLists.toArray(new BoardList[0]);
    }


    // Utility method to get a BoardList by its ID from a Board
    public BoardList getBoardListByIdFromBoard(Board board, Long listId) throws NotFoundException {
        return board.getLists().stream()
                .filter(list -> list.getBoardListId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("List not found"));
    }

}
