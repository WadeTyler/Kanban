package net.tylerwade.kanban.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.board.BoardList;

@Getter
@Setter
@NoArgsConstructor
public class UpdateAllBoardListsRequest {

    private BoardList[] updatedBoardLists;

}
