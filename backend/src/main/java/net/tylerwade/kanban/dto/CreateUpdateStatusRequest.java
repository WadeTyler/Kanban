package net.tylerwade.kanban.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateUpdateStatusRequest {

    private String status;
    private String color;
}
