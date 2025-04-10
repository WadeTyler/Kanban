package net.tylerwade.kanban.service.boardlist;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.dto.UpdateAllBoardListsRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import org.springframework.stereotype.Service;

@Service
public interface BoardListService {

    @Transactional
    BoardList createBoardList(Board board, String name, User user) throws NotFoundException, BadRequestException;


    @Transactional
    BoardList[] updateBoardLists(Board board, UpdateAllBoardListsRequest updatedBoardListsRequests) throws NotFoundException;


    BoardList getBoardListByIdFromBoard(Board board, Long listId) throws NotFoundException;

}
