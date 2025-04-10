package net.tylerwade.kanban.service.listitem;

import jakarta.transaction.Transactional;
import net.tylerwade.kanban.dto.CreateListItemRequest;
import net.tylerwade.kanban.dto.UpdateListItemRequest;
import net.tylerwade.kanban.exception.BadRequestException;
import net.tylerwade.kanban.exception.NotFoundException;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.Board;
import net.tylerwade.kanban.model.board.BoardList;
import net.tylerwade.kanban.model.board.ListItem;
import net.tylerwade.kanban.repository.BoardListRepository;
import net.tylerwade.kanban.repository.ListItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Objects;

@Service
public class ListItemServiceImpl implements ListItemService {

    private final ListItemRepository listItemRepository;
    private final BoardListRepository boardListRepository;

    @Autowired
    public ListItemServiceImpl(ListItemRepository listItemRepository, BoardListRepository boardListRepository) {
        this.listItemRepository = listItemRepository;
        this.boardListRepository = boardListRepository;
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

    public void removeFromAssignedListItemsInBoard(User user, Board board) {
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

        listItemRepository.save(listItem);

        return listItem.getBoardList();
    }

    @Transactional
    public BoardList deleteListItem(BoardList boardList, Long itemId) throws NotFoundException {
        // get managed instance of board list
        BoardList managedBoardList = boardListRepository.findById(boardList.getBoardListId())
                .orElseThrow(() -> new NotFoundException("Board list not found"));

        // Find list item in boardlist
        ListItem listItem = managedBoardList.getListItems().stream()
                .filter(item -> item.getListItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("List item not found"));

        // Remove
        managedBoardList.getListItems().remove(listItem);
        // Save
        boardListRepository.save(managedBoardList);

        return managedBoardList;
    }
}
