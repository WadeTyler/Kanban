package net.tylerwade.kanban.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateBoardDetailsRequest {
    private String name;
    private String description;
}
