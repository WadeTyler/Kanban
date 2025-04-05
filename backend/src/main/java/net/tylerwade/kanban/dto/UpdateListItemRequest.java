package net.tylerwade.kanban.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.kanban.model.User;
import net.tylerwade.kanban.model.board.BoardStatusType;

@Getter @Setter @NoArgsConstructor
public class UpdateListItemRequest {

    private String title;
    private String description;
    private BoardStatusType status;
    private String color;
    private User assignedTo;
    private String dueDate;
    private Integer position;

}
