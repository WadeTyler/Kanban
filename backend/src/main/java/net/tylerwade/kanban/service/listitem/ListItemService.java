package net.tylerwade.kanban.service.listitem;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import org.springframework.stereotype.Service;

@Service
public interface ListItemService {

    BoardList createNewListItem(BoardList boardList, CreateListItemRequest createListItemRequest) throws BadRequestException;

    void removeFromAssignedListItemsInBoard(User user, Board board);

    BoardList updateListItem(BoardList boardList, Long itemId, UpdateListItemRequest updateListItemRequest) throws BadRequestException;

    @Transactional
    BoardList deleteListItem(BoardList boardList, Long itemId) throws NotFoundException;
}
