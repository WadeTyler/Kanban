package net.tylerwade.kanban.model.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "board_status_types")
@Getter
@Setter
@NoArgsConstructor
public class BoardStatusType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;

    private String getBoardId() {
        return board.getBoardId();
    }

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String color;

    public BoardStatusType(Board board, String status, String color) {
        this.board = board;
        this.status = status;
        this.color = color;
    }
}
