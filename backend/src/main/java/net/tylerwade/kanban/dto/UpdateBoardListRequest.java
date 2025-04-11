package net.tylerwade.kanban.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateBoardListRequest {
    private Long boardListId;
    private String name;
}
